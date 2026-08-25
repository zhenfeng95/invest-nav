<script setup lang="ts">
import { getTools } from '~/utils/tools'

const tools = getTools()

usePageSeo({
  title: '投资工具',
  description: '投资组合追踪、QDII额度宝、财经日历、抄底信号和空间计算器。',
  path: '/tools',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Tools"
      title="投资工具"
      description="第一阶段先提供工具入口和 Coming Soon 状态。真实计算与行情接口会在后续接入。"
    />
    <ToolGrid :items="tools" />
  </AppContainer>
</template>
