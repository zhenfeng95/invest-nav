<script setup lang="ts">
import { getTutorialsByType } from '~/utils/tutorials'

const items = getTutorialsByType('article')

usePageSeo({
  title: '文字教程',
  description: '美股券商、港卡开户、出入金和投资基础相关的文字教程。',
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
