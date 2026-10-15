<script setup lang="ts">
import type { NavItem } from '~/utils/site';
import { mainNav, SITE_NAME } from '~/utils/site';
import { getHeaderNavContextPath } from '~/utils/navigation';
import { getTutorialMetaBySlug } from '~/utils/tutorial-meta';

const route = useRoute();
const mobileOpen = ref(false);
const mobileExpanded = ref<string | null>(null);
/** 桌面端当前展开的二级菜单；null 表示全部收起 */
const desktopOpenLabel = ref<string | null>(null);
/** 点击子项后强制收起，直到鼠标离开该菜单组，避免 hover 立刻又打开 */
const desktopHoverLocked = ref(false);

/** 教程详情映射到的菜单路径；有值时按映射高亮，不改教程路由 */
const navContextPath = computed(() => {
    const match = route.path.match(/^\/tutorials\/([^/]+)$/);
    const slug = match?.[1];
    const category = slug ? getTutorialMetaBySlug(slug)?.category : undefined;
    return getHeaderNavContextPath(route.path, category);
});

function closeMobile() {
    mobileOpen.value = false;
    mobileExpanded.value = null;
}

function closeDesktop() {
    desktopOpenLabel.value = null;
}

function openDesktop(label: string) {
    if (desktopHoverLocked.value) {
        return;
    }
    desktopOpenLabel.value = label;
}

function onDesktopLeave() {
    closeDesktop();
    desktopHoverLocked.value = false;
}

function onDesktopChildNavigate() {
    closeDesktop();
    desktopHoverLocked.value = true;
    if (import.meta.client) {
        (document.activeElement as HTMLElement | null)?.blur();
    }
}

function parseNavTarget(to: string) {
    const qIndex = to.indexOf('?');
    const pathname = qIndex === -1 ? to : to.slice(0, qIndex);
    const params = new URLSearchParams(qIndex === -1 ? '' : to.slice(qIndex + 1));
    return { pathname, params };
}

function pathMatches(activePath: string, path: string) {
    if (path === '/' || path === '/nav') {
        return activePath === path;
    }
    return activePath === path || activePath.startsWith(`${path}/`);
}

function queryMatches(params: URLSearchParams) {
    for (const [key, value] of params) {
        if (String(route.query[key] ?? '') !== value) {
            return false;
        }
    }
    return true;
}

/** matchQuery：子项需对齐 ?market= 等参数；父级高亮只比路径 */
function isActive(to: string, matchQuery = true) {
    const { pathname, params } = parseNavTarget(to);
    const contextPath = navContextPath.value;
    if (contextPath) {
        // 已映射到业务菜单时，不再高亮「教程」
        if (pathname === '/tutorials') {
            return false;
        }
        return pathMatches(contextPath, pathname);
    }
    if (!pathMatches(route.path, pathname)) {
        return false;
    }
    if (matchQuery && params.size > 0) {
        return queryMatches(params);
    }
    return true;
}

function isNavItemActive(item: NavItem) {
    if (item.to) {
        return isActive(item.to);
    }
    if (item.children?.some(child => isActive(child.to, false))) {
        return true;
    }
    // 如盈立等未进港资/美资子菜单的券商教程：高亮「港美股券商」父级
    const contextPath = navContextPath.value;
    if (!contextPath || !item.children?.length) {
        return false;
    }
    return item.children.some(child => {
        const { pathname } = parseNavTarget(child.to);
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length < 3) {
            return false;
        }
        const sectionRoot = `/${segments.slice(0, -1).join('/')}`;
        return contextPath === sectionRoot || contextPath.startsWith(`${sectionRoot}/`);
    });
}

function toggleMobileSection(label: string) {
    mobileExpanded.value = mobileExpanded.value === label ? null : label;
}

watch(mobileOpen, value => {
    if (!import.meta.client) {
        return;
    }
    document.body.style.overflow = value ? 'hidden' : '';
});

watch(
    () => route.path,
    () => {
        closeMobile();
        closeDesktop();
    }
);

onBeforeUnmount(() => {
    if (import.meta.client) {
        document.body.style.overflow = '';
    }
});
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b border-zinc-200/70 bg-canvas/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-canvas-dark/80"
    >
        <AppContainer>
            <div class="flex h-16 items-center justify-between gap-4">
                <NuxtLink to="/" class="flex min-w-0 items-center gap-2 text-zinc-900 dark:text-zinc-50">
                    <img
                        src="/logo.png"
                        :alt="`${SITE_NAME} 标志`"
                        class="h-7 w-7 shrink-0 rounded-sm object-contain"
                    />
                    <span class="truncate text-sm font-semibold tracking-tight">{{ SITE_NAME }}</span>
                </NuxtLink>

                <nav class="hidden shrink-0 items-center gap-1 lg:flex" aria-label="主导航">
                    <template v-for="item in mainNav" :key="item.label">
                        <div
                            v-if="item.children"
                            class="relative"
                            @mouseenter="openDesktop(item.label)"
                            @mouseleave="onDesktopLeave"
                            @focusin="openDesktop(item.label)"
                        >
                            <button
                                type="button"
                                class="inline-flex items-center gap-1 rounded-[6px] px-3 py-1.5 text-sm transition"
                                :class="
                                    isNavItemActive(item)
                                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                                "
                                :aria-expanded="desktopOpenLabel === item.label"
                            >
                                {{ item.label }}
                                <AppIcon
                                    name="chevron-down"
                                    class="h-3.5 w-3.5 opacity-60 transition"
                                    :class="desktopOpenLabel === item.label ? 'rotate-180' : ''"
                                />
                            </button>
                            <div
                                class="absolute left-0 top-full z-50 pt-1 transition"
                                :class="
                                    desktopOpenLabel === item.label
                                        ? 'pointer-events-auto visible opacity-100'
                                        : 'pointer-events-none invisible opacity-0'
                                "
                            >
                                <div
                                    class="min-w-[8.5rem] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-[#111318]"
                                >
                                    <NuxtLink
                                        v-for="child in item.children"
                                        :key="child.to"
                                        :to="child.to"
                                        class="block rounded-lg px-3 py-2 text-sm transition"
                                        :class="
                                            isActive(child.to)
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white'
                                        "
                                        @click="onDesktopChildNavigate"
                                    >
                                        {{ child.label }}
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                        <NuxtLink
                            v-else
                            :to="item.to!"
                            class="rounded-[6px] px-3 py-1.5 text-sm transition"
                            :class="
                                isActive(item.to!)
                                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'
                            "
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </template>
                </nav>

                <div class="flex items-center gap-2">
                    <SearchEntry />
                    <ClientOnly>
                        <ThemeToggle />
                        <template #fallback>
                            <div class="h-9 w-9 rounded-full border border-zinc-200/80 dark:border-white/10" />
                        </template>
                    </ClientOnly>
                    <button
                        type="button"
                        class="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 lg:hidden dark:border-white/10 dark:text-zinc-300"
                        :aria-expanded="mobileOpen"
                        aria-label="打开菜单"
                        @click="mobileOpen = true"
                    >
                        <AppIcon name="menu" class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </AppContainer>

        <Teleport to="body">
            <div v-if="mobileOpen" class="fixed inset-0 z-[60] lg:hidden">
                <button
                    type="button"
                    class="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm dark:bg-black/50"
                    aria-label="关闭菜单"
                    @click="closeMobile"
                />
                <div
                    class="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111318]"
                >
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">菜单</p>
                        <button type="button" class="focus-ring rounded-full p-1 text-zinc-500" aria-label="关闭菜单" @click="closeMobile">
                            <AppIcon name="close" class="h-4 w-4" />
                        </button>
                    </div>
                    <nav class="mt-6 flex flex-col gap-1" aria-label="移动端导航">
                        <template v-for="item in mainNav" :key="item.label">
                            <div v-if="item.children">
                                <button
                                    type="button"
                                    class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base transition"
                                    :class="
                                        isNavItemActive(item)
                                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5'
                                    "
                                    :aria-expanded="mobileExpanded === item.label"
                                    @click="toggleMobileSection(item.label)"
                                >
                                    {{ item.label }}
                                    <AppIcon
                                        name="chevron-down"
                                        class="h-4 w-4 opacity-60 transition"
                                        :class="mobileExpanded === item.label ? 'rotate-180' : ''"
                                    />
                                </button>
                                <div v-show="mobileExpanded === item.label" class="mt-1 flex flex-col gap-1 pl-3">
                                    <NuxtLink
                                        v-for="child in item.children"
                                        :key="child.to"
                                        :to="child.to"
                                        class="rounded-xl px-3 py-2.5 text-sm transition"
                                        :class="
                                            isActive(child.to)
                                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                                : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5'
                                        "
                                    >
                                        {{ child.label }}
                                    </NuxtLink>
                                </div>
                            </div>
                            <NuxtLink
                                v-else
                                :to="item.to!"
                                class="rounded-xl px-3 py-3 text-base transition"
                                :class="
                                    isActive(item.to!)
                                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5'
                                "
                            >
                                {{ item.label }}
                            </NuxtLink>
                        </template>
                    </nav>
                </div>
            </div>
        </Teleport>
    </header>
</template>
