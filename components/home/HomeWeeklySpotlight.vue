<script setup lang="ts">
import { homeWeeklySpotlight } from '~/utils/home'
import { prefetchTutorialBySlug } from '~/utils/tutorials'

const spotlight = homeWeeklySpotlight
const items = computed(() => spotlight?.items ?? [])

function prefetchFromTo(to: string) {
  const match = to.match(/^\/tutorials\/([^/]+)/)
  if (match?.[1]) {
    prefetchTutorialBySlug(match[1])
  }
}

onMounted(() => {
  const run = () => {
    for (const item of items.value) {
      prefetchFromTo(item.to)
    }
  }
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 2000 })
  } else {
    setTimeout(run, 400)
  }
})
</script>

<template>
  <section v-if="spotlight && items.length" class="space-y-3">
    <p class="text-xs font-medium tracking-[0.14em] text-accent">
      {{ spotlight.label }}
    </p>

    <div class="grid grid-cols-2 gap-3">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="group flex flex-col gap-3 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3.5 shadow-card transition hover:border-zinc-300 dark:border-white/[0.08] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-white/15 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-4"
        @pointerenter="prefetchFromTo(item.to)"
        @focusin="prefetchFromTo(item.to)"
      >
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {{ item.title }}
            </p>
            <span
              v-if="item.badge"
              class="inline-flex shrink-0 items-center gap-1 rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200"
            >
              <span class="text-[12px] leading-none" aria-hidden="true">🔥</span>
              {{ item.badge }}
            </span>
          </div>
          <p class="mt-0.5 line-clamp-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {{ item.description }}
          </p>
        </div>

        <span class="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-900 transition group-hover:gap-2 dark:text-zinc-100">
          阅读
          <AppIcon name="arrow-right" class="h-4 w-4" />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
