<script setup lang="ts">
import { buildToolGuideJsonLd } from '~/utils/jsonld'
import { getToolBySlug } from '~/utils/tools'
import { getToolGuide } from '~/utils/tool-guides'

const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl).replace(/\/$/, '')

const slug = String(route.params.slug)
const tool = getToolBySlug(slug)

if (!tool) {
  throw createError({
    statusCode: 404,
    statusMessage: '工具不存在',
  })
}

if (tool.route !== `/tools/${slug}`) {
  await navigateTo(tool.route, { redirectCode: 301 })
}

const guide = getToolGuide(tool.id)

usePageSeo({
  title: `${tool.name}｜投资计算与规划工具`,
  description: guide?.seoDescription || tool.description,
  path: tool.route,
})

if (guide) {
  useJsonLd(
    'ld-json-tool-guide',
    buildToolGuideJsonLd(siteUrl, {
      name: tool.name,
      description: guide.seoDescription || tool.description,
      path: tool.route,
      guide,
    }),
  )
}

const iframeRef = ref<HTMLIFrameElement | null>(null)
/** 按空间六象图设计稿预留高度，收到子页上报后会动态覆盖 */
const iframeHeight = ref(600)

function isSpatialHeightMessage(data: unknown): data is { source: string; type: string; height: number } {
  if (!data || typeof data !== 'object') {
    return false
  }
  const message = data as Record<string, unknown>
  return message.source === 'spatial-embed' && message.type === 'spatial-embed-height' && typeof message.height === 'number'
}

function onMessage(event: MessageEvent) {
  if (event.source && iframeRef.value?.contentWindow && event.source !== iframeRef.value.contentWindow) {
    return
  }
  if (!isSpatialHeightMessage(event.data)) {
    return
  }

  const next = Math.min(Math.round(event.data.height), 4000)
  if (next > 100 && Math.abs(next - iframeHeight.value) >= 2) {
    iframeHeight.value = next
  }
}

onMounted(() => {
  window.addEventListener('message', onMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
})
</script>

<template>
  <AppContainer v-if="tool" class="space-y-8 py-12 sm:py-16">
    <div>
      <NuxtLink
        to="/tools"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      >
        返回投资工具
      </NuxtLink>
      <PageHero
        class="mt-6"
        :title="tool.name"
        :description="tool.description"
      />
    </div>

    <div v-if="tool.iframeSrc" class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10">
      <iframe
        ref="iframeRef"
        :src="tool.iframeSrc"
        :title="tool.name"
        :style="{ height: `${iframeHeight}px` }"
        class="block w-full border-0 bg-[#1b1b1f]"
        scrolling="no"
        referrerpolicy="no-referrer"
      />
    </div>

    <EconomicCalendar v-else-if="tool.id === 'calendar'" />

    <CompoundInterestCalculator v-else-if="tool.id === 'compound-interest'" />

    <FxPurchaseEstimator v-else-if="tool.id === 'fx-estimate'" />

    <PositionRiskCalculator v-else-if="tool.id === 'position-risk'" />

    <TradePnlCalculator v-else-if="tool.id === 'trade-pnl'" />

    <TargetContributionCalculator v-else-if="tool.id === 'target-contribution'" />

    <EmptyState v-else title="功能开发中" description="第一阶段不实现真实金融计算。页面路由、工具状态和 Mock API 已经预留。">
      <p v-if="tool.apiPath" class="mt-4 text-xs text-zinc-400">预留接口：{{ tool.apiPath }}</p>
    </EmptyState>

    <ToolGuide
      v-if="guide"
      :guide="guide"
    />
  </AppContainer>
</template>
