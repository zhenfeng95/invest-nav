<script setup lang="ts">
import type { ReportListResponse } from '~/types/report'
import { formatDate } from '~/utils/format'

const { data } = await useAsyncData(
  'home-reports',
  () => $fetch<ReportListResponse>('/api/reports').catch(() => ({
    configured: false,
    source: null,
    items: [],
  })),
)

const latest = computed(() => data.value?.items.slice(0, 3) ?? [])
</script>

<template>
  <section v-if="latest.length">
    <div class="flex items-end justify-between gap-4">
      <SectionTitle
        title="最新收盘日报"
        description="投研 Agent 每个工作日生成的市场复盘。"
      />
      <NuxtLink
        to="/reports"
        class="hidden shrink-0 text-sm text-zinc-500 hover:text-zinc-900 sm:inline dark:hover:text-white"
      >
        查看全部
      </NuxtLink>
    </div>
    <div class="mt-8 grid gap-3">
      <NuxtLink
        v-for="item in latest"
        :key="item.slug"
        :to="`/reports/${item.slug}`"
        class="card card-hover flex items-start justify-between gap-4 p-5"
      >
        <div class="min-w-0">
          <p class="text-xs text-zinc-400">
            {{ item.date ? formatDate(item.date) : '收盘日报' }}
          </p>
          <p class="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {{ item.title }}
          </p>
        </div>
        <AppIcon name="arrow-right" class="mt-1 h-4 w-4 shrink-0 text-zinc-400" />
      </NuxtLink>
    </div>
  </section>
</template>
