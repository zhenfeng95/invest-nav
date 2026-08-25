<script setup lang="ts">
import { getToolBySlug, getToolStatusLabel } from '~/utils/tools';

const route = useRoute();
const slug = String(route.params.slug);
const tool = getToolBySlug(slug);

if (!tool) {
    throw createError({
        statusCode: 404,
        statusMessage: '工具不存在',
    });
}

if (tool.route !== `/tools/${slug}`) {
    await navigateTo(tool.route, { redirectCode: 301 });
}

usePageSeo({
    title: tool.name,
    description: tool.description,
    path: tool.route,
});

const iframeRef = ref<HTMLIFrameElement | null>(null);
/** 按空间六象图 414×736 设计稿预留完整高度，避免 iframe 默认 150px 裁切 */
const iframeHeight = ref(550);

function onIframeLoad() {
    const doc = iframeRef.value?.contentDocument;
    if (!doc || doc.getElementById('spatial-embed-style')) {
        return;
    }

    const app = doc.getElementById('app');
    if (app) {
        const height = Math.ceil(Math.max(app.scrollHeight, app.offsetHeight));
        if (height > 100) {
            iframeHeight.value = height + 24;
        }
    }
}
</script>

<template>
    <AppContainer v-if="tool" class="space-y-8 py-12 sm:py-16">
        <PageHero :eyebrow="getToolStatusLabel(tool.status)" :title="tool.name" :description="tool.description" />
        <div v-if="tool.iframeSrc" class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
            <iframe
                ref="iframeRef"
                :src="tool.iframeSrc"
                :title="tool.name"
                :style="{ height: `${iframeHeight}px` }"
                class="block w-full border-0 bg-[#1b1b1f]"
                scrolling="no"
                referrerpolicy="no-referrer"
                @load="onIframeLoad"
            />
        </div>
        <EmptyState v-else title="功能开发中" description="第一阶段不实现真实金融计算。页面路由、工具状态和 Mock API 已经预留。">
            <p v-if="tool.apiPath" class="mt-4 text-xs text-zinc-400">预留接口：{{ tool.apiPath }}</p>
        </EmptyState>
    </AppContainer>
</template>
