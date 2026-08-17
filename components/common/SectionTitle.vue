<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="max-w-2xl">
    <p
      v-if="eyebrow"
      class="text-xs font-medium uppercase tracking-[0.18em] text-accent"
    >
      {{ eyebrow }}
    </p>
    <h2 class="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-3 text-sm leading-6 text-zinc-500 sm:text-base dark:text-zinc-400"
    >
      {{ description }}
    </p>
  </div>
</template>
