<script setup lang="ts">
import { getTutorialsByType } from '~/utils/tutorials'

const items = getTutorialsByType('infographic')

usePageSeo({
  title: '一图看懂｜账户结构与资金路径',
  description: '通过一图看懂快速理解券商账户结构、银行到券商的资金路径，以及 ETF 基本分类。Zhen Invest 用更直观的结构图降低跨境投资信息密度，便于快速建立全局认知。',
  path: '/tutorials/infographics',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Infographics"
      title="一图看懂投资"
      description="第一阶段使用占位图片，后续可替换为完整信息图。"
    />
    <TutorialTabs />
    <TutorialList :items="items" />
  </AppContainer>
</template>
