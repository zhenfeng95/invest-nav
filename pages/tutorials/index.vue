<script setup lang="ts">
import { getLatestTutorials, getPopularTutorials, getTutorials } from '~/utils/tutorials'

const popular = getPopularTutorials(6)
const latest = getLatestTutorials(6)
const total = getTutorials().length

usePageSeo({
  title: '投资教程',
  description: '美股、港卡、加密货币与投资工具相关教程，包含文字、视频和一图看懂。',
  path: '/tutorials',
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Tutorials"
      title="投资教程"
      description="从开户、入金到券商和投资工具，用更清楚的结构学习投资基础。"
    />
    <p class="text-sm text-zinc-400">共 {{ total }} 篇内容</p>
    <TutorialTabs />
    <section>
      <SectionTitle title="热门教程" description="先看这些就能建立基本框架。" />
      <TutorialList :items="popular" class="mt-8" />
    </section>
    <section>
      <SectionTitle title="最新教程" description="按更新时间排列。" />
      <TutorialList :items="latest" class="mt-8" />
    </section>
  </AppContainer>
</template>
