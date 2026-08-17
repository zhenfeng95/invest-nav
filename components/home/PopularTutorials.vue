<script setup lang="ts">
import { getPopularTutorials } from '~/utils/tutorials'

const tutorials = getPopularTutorials(6)
</script>

<template>
  <section>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="热门教程"
        description="从开户、入金到投资工具，快速掌握投资基础。"
      />
      <NuxtLink
        to="/tutorials"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        查看全部
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>
    <TutorialList :items="tutorials" class="mt-8" />
  </section>
</template>
