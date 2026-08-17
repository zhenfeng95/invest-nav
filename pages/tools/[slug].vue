<script setup lang="ts">
import { getToolBySlug, getToolStatusLabel } from '~/utils/tools'

const route = useRoute()
const slug = String(route.params.slug)
const tool = getToolBySlug(slug)

if (!tool) {
  throw createError({
    statusCode: 404,
    statusMessage: '工具不存在',
  })
}

usePageSeo({
  title: tool.name,
  description: tool.description,
  path: tool.route,
})
</script>

<template>
  <AppContainer v-if="tool" class="space-y-8 py-12 sm:py-16">
    <PageHero
      :eyebrow="getToolStatusLabel(tool.status)"
      :title="tool.name"
      :description="tool.description"
    />
    <EmptyState
      title="功能开发中"
      description="第一阶段不实现真实金融计算。页面路由、工具状态和 Mock API 已经预留。"
    >
      <p v-if="tool.apiPath" class="mt-4 text-xs text-zinc-400">
        预留接口：{{ tool.apiPath }}
      </p>
    </EmptyState>
  </AppContainer>
</template>
