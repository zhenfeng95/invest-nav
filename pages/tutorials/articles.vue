<script setup lang="ts">
import { getTutorialsByType } from '~/utils/tutorials'

const items = getTutorialsByType('article')

usePageSeo({
  title: '文字教程｜开户出入金分步说明',
  description: '阅读 Zhen Invest 文字教程，系统了解美股券商开户、港卡申请、出入金路径与投资基础概念，适合希望按步骤对照官方说明、逐步建立操作框架的内地用户。',
  path: '/tutorials/articles',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Articles"
      title="文字教程"
      description="适合系统阅读的投资入门内容。"
    />
    <TutorialTabs />
    <TutorialList :items="items" />
  </AppContainer>
</template>
