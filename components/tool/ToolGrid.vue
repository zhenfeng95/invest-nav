<script setup lang="ts">
import type { Tool } from '~/types/tool'

defineProps<{
  items: Tool[]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <ToolCard
      v-for="item in items"
      :key="item.id"
      :tool="item"
    />
  </div>
</template>
