<script setup lang="ts">
const route = useRoute();

const tabs = [
    { label: '全部', to: '/tutorials' },
    { label: '文字教程', to: '/tutorials/articles' },
    // { label: '视频教程', to: '/tutorials/videos' },
    { label: '一图看懂', to: '/tutorials/infographics' },
];

function isActive(path: string) {
    return route.path === path;
}
</script>

<template>
    <div class="-mx-4 overflow-x-auto px-4">
        <div
            class="inline-flex min-w-max gap-2 rounded-full border border-zinc-200/80 bg-white p-1 dark:border-white/10 dark:bg-white/[0.03]"
        >
            <NuxtLink
                v-for="tab in tabs"
                :key="tab.to"
                :to="tab.to"
                class="rounded-full px-4 py-2 text-sm transition"
                :class="
                    isActive(tab.to)
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                "
            >
                {{ tab.label }}
            </NuxtLink>
        </div>
    </div>
</template>
