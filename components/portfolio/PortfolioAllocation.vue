<script setup lang="ts">
import type { AllocationRow } from '~/types/portfolio'

defineProps<{
  rows: AllocationRow[]
}>()
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="row in rows"
      :key="row.key"
      class="grid items-center gap-3 sm:grid-cols-[5.5rem_1fr_4.5rem]"
    >
      <p class="text-sm text-zinc-600 dark:text-zinc-300">{{ row.label }}</p>
      <div class="space-y-1.5">
        <div class="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
          <div
            class="h-full rounded-full bg-zinc-300 dark:bg-white/20"
            :style="{ width: `${Math.min(row.targetPct, 100)}%` }"
          />
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
          <div
            class="h-full rounded-full bg-accent"
            :style="{ width: `${Math.min(row.actualPct, 100)}%` }"
          />
        </div>
      </div>
      <p class="text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
        {{ row.actualPct.toFixed(1) }}% / {{ row.targetPct.toFixed(0) }}%
      </p>
    </div>
    <p class="text-xs text-zinc-400">细条是目标占比，粗条是当前市值占比。</p>
  </div>
</template>
