<script setup lang="ts">
import { getTools } from '~/utils/tools'

const tools = getTools()

usePageSeo({
  title: '投资工具｜日历计算器与仓位风控',
  description: 'Zhen Invest 投资工具入口，提供财经日历、空间计算器、复利计算器、汇率购汇估算与仓位风控等实用功能，帮助跟踪经济节点、推演价格空间、规划出入金与仓位，后续将持续接入更多分析工具。',
  path: '/tools',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Tools"
      title="投资工具"
      description="跟踪财经节点、推演价格空间、估算复利与购汇成本、规划仓位风控。更多分析工具会持续接入。"
    />
    <ToolGrid :items="tools" />
  </AppContainer>
</template>
