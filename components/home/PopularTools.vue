<script setup lang="ts">
import { getTools } from '~/utils/tools'

const tools = getTools()
</script>

<template>
  <section>
    <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionTitle
        title="常用工具"
        description="财经日历与空间计算器，跟踪市场节点、推演关键价格位。"
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
