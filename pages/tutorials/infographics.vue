<script setup lang="ts">
import { getTutorialsByType } from '~/utils/tutorials'

const items = getTutorialsByType('infographic')

usePageSeo({
  title: '一图看懂投资',
  description: '用信息图快速理解账户、资金路径和 ETF 分类。',
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
