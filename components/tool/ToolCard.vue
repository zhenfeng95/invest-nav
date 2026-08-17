<script setup lang="ts">
import type { Tool } from '~/types/tool'
import { getToolStatusLabel } from '~/utils/tools'

defineProps<{
  tool: Tool
}>()
</script>

<template>
  <NuxtLink
    :to="tool.route"
    class="card card-hover flex h-full flex-col p-5"
  >
    <div class="flex items-start justify-between gap-3">
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-accent dark:border-white/10">
        <AppIcon :name="tool.icon" class="h-5 w-5" />
      </span>
      <span class="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        {{ getToolStatusLabel(tool.status) }}
      </span>
    </div>
    <h3 class="mt-5 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
      {{ tool.name }}
    </h3>
    <p class="mt-2 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
      {{ tool.description }}
    </p>
  </NuxtLink>
</template>
