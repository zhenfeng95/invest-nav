<script setup lang="ts">
import { getTutorialsByType } from '~/utils/tutorials'

const items = getTutorialsByType('video')

usePageSeo({
  title: '视频教程',
  description: '短视频形式的投资教程。第一阶段使用 Mock 数据。',
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
