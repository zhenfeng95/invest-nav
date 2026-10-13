<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

const props = defineProps<{
  item: NavigationItem
}>()

const displayTags = computed(() => props.item.tags.slice(0, 2))
</script>

<template>
  <article
    class="relative flex h-full flex-col border-b border-zinc-200/80 py-6 last:border-b-0 dark:border-white/[0.08] sm:border sm:border-zinc-200/80 sm:rounded-2xl sm:bg-white sm:p-5 sm:shadow-card dark:sm:border-white/[0.08] dark:sm:bg-white/[0.03] dark:sm:shadow-none"
    :class="{ 'sm:overflow-hidden': item.statusBadge }"
  >
    <span
      v-if="item.statusBadge"
      class="absolute right-px top-px z-10 inline-flex items-center gap-1 rounded-bl-lg rounded-tr-[0.9rem] border border-rose-500/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200"
    >
      <span class="text-[12px] leading-none" aria-hidden="true">🔥</span>
      {{ item.statusBadge }}
    </span>
    <div class="flex items-start justify-between gap-3" :class="{ 'pr-[7.5rem]': item.statusBadge }">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ item.name }}
          </h3>
          <span
            v-if="item.featured"
            class="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500 dark:border-white/10 dark:text-zinc-400"
          >
            常用
          </span>
        </div>
      </div>
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
    <div
      v-if="displayTags.length"
      class="mt-4 flex flex-wrap gap-2"
    >
      <span
        v-for="tag in displayTags"
        :key="tag"
        class="text-xs text-zinc-400"
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
        {{ item.guideLabel || '查看教程' }}
        <AppIcon name="arrow-right" class="h-4 w-4" />
      </NuxtLink>
      <a
        v-if="item.url"
        :href="item.url"
        target="_blank"
        rel="noreferrer noopener"
        class="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        访问官网
        <AppIcon name="external" class="h-3.5 w-3.5" />
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
