<script setup lang="ts">
import { getTools } from '~/utils/tools'

const tools = getTools()

usePageSeo({
  title: '投资工具',
  description: 'Zhen Invest 投资工具入口，提供财经日历与空间计算器等实用功能，帮助跟踪经济数据发布、利率就业等节点，并推演价格空间，后续将持续接入更多分析工具。',
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
