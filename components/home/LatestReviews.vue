<script setup lang="ts">
import type { ReportListResponse } from '~/types/report'
import { formatYearMonth } from '~/utils/format'

const nuxtApp = useNuxtApp()
const { data } = await useAsyncData(
  'reviews',
  () => $fetch<ReportListResponse>('/api/reviews'),
  {
    lazy: import.meta.client,
    getCachedData: key => nuxtApp.payload.data[key],
  },
)

const latest = computed(() => data.value?.items.slice(0, 2) ?? [])
</script>

<template>
  <section v-if="latest.length">
    <div class="flex items-end justify-between gap-4">
      <SectionTitle
        title="最新月度复盘"
        description="投研 Agent 每月生成的交易复盘与纪律改进。"
      />
      <NuxtLink
        to="/reviews"
        class="hidden shrink-0 text-sm text-zinc-500 hover:text-zinc-900 sm:inline dark:hover:text-white"
      >
        查看全部
      </NuxtLink>
    </div>
    <div class="mt-8 grid gap-3">
      <NuxtLink
        v-for="item in latest"
        :key="item.slug"
        :to="`/reviews/${item.slug}`"
        class="card card-hover flex items-start justify-between gap-4 p-5"
      >
        <div class="min-w-0">
          <p class="text-xs text-zinc-400">
            {{ item.date ? formatYearMonth(item.date) : '月度复盘' }}
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
