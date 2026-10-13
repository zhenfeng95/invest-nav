<script setup lang="ts">
import { getFeaturedTools } from '~/utils/tools'

const tools = getFeaturedTools()
</script>

<template>
  <section>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="常用工具"
        description="购汇估算、财经日历、空间推演与复利规划，覆盖出入金与复盘常用场景。"
      />
      <NuxtLink
        to="/tools"
        class="inline-flex items-center gap-1 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
      >
        查看全部
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
    </div>
    <ToolGrid :items="tools" class="mt-8" />
  </section>
</template>
