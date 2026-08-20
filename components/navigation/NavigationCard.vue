<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

defineProps<{
  item: NavigationItem
}>()
</script>

<template>
  <article class="card flex h-full flex-col p-5">
    <div class="flex items-start justify-between gap-3">
      <h3 class="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ item.name }}
      </h3>
      <span
        v-if="!item.officialUrlConfirmed"
        class="shrink-0 rounded-full border border-amber-500/20 px-2 py-0.5 text-[11px] text-amber-700 dark:text-amber-200/80"
      >
        TODO
      </span>
    </div>
    <p class="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
      {{ item.description }}
    </p>
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="tag in item.tags"
        :key="tag"
        class="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400"
      >
        {{ tag }}
      </span>
    </div>
    <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      <NuxtLink
        v-if="item.guideUrl"
        :to="item.guideUrl"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition hover:gap-2 dark:text-zinc-100"
      >
        {{ item.guideLabel || '开户教程' }}
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noreferrer noopener"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 transition hover:gap-2 dark:text-zinc-100"
      >
        访问官网
        <AppIcon name="external" class="h-4 w-4" />
      </a>
      <p
        v-else-if="!item.guideUrl"
        class="text-sm text-zinc-400"
      >
        官网待确认
      </p>
    </div>
  </article>
</template>
