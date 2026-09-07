<script setup lang="ts">
import { getTutorialsByType } from '~/utils/tutorials'

const items = getTutorialsByType('video')

usePageSeo({
  title: '视频教程',
  description: '以短视频形式学习跨境投资基础：开户材料、W-8BEN、出入金核对与常见操作步骤。Zhen Invest 视频教程持续更新，帮助你更快抓住关键流程要点。',
  path: '/tutorials/videos',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Videos"
      title="视频教程"
      description="第一阶段使用占位视频数据，后续再接入真实播放源。"
    />
    <TutorialTabs />
    <TutorialList :items="items" />
  </AppContainer>
</template>
