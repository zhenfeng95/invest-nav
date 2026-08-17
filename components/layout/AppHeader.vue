<script setup lang="ts">
import { mainNav, SITE_NAME } from '~/utils/site'

const route = useRoute()
const mobileOpen = ref(false)

function closeMobile() {
  mobileOpen.value = false
}

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

watch(mobileOpen, (value) => {
  if (!import.meta.client) {
    return
  }
  document.body.style.overflow = value ? 'hidden' : ''
})

watch(() => route.path, closeMobile)

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-zinc-200/70 bg-canvas/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-canvas-dark/80">
    <AppContainer>
      <div class="flex h-16 items-center justify-between gap-4">
        <NuxtLink to="/" class="flex min-w-0 items-center gap-2 text-zinc-900 dark:text-zinc-50">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-accent dark:border-white/10 dark:bg-white/5">
            <AppIcon name="logo" class="h-4 w-4" />
          </span>
          <span class="truncate text-sm font-semibold tracking-tight">{{ SITE_NAME }}</span>
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex" aria-label="主导航">
          <NuxtLink
            v-for="item in mainNav"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-3 py-1.5 text-sm transition"
            :class="isActive(item.to)
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
              : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white'"
          >
            {{ item.label }}
          </NuxtLink>
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
            class="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 md:hidden dark:border-white/10 dark:text-zinc-300"
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
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-[60] md:hidden"
      >
        <button
          type="button"
          class="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm dark:bg-black/50"
          aria-label="关闭菜单"
          @click="closeMobile"
        />
        <div class="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col border-l border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111318]">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-zinc-900 dark:text-zinc-50">菜单</p>
            <button
              type="button"
              class="focus-ring rounded-full p-1 text-zinc-500"
              aria-label="关闭菜单"
              @click="closeMobile"
            >
              <AppIcon name="close" class="h-4 w-4" />
            </button>
          </div>
          <nav class="mt-6 flex flex-col gap-1" aria-label="移动端导航">
            <NuxtLink
              v-for="item in mainNav"
              :key="item.to"
              :to="item.to"
              class="rounded-xl px-3 py-3 text-base transition"
              :class="isActive(item.to)
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5'"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </Teleport>
  </header>
</template>
