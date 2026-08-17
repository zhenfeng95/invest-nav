<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'

defineProps<{
  items: NavigationItem[]
}>()
</script>

<template>
  <div v-if="items.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <NavigationCard
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
  <EmptyState
    v-else
    title="暂无资源"
    description="这个分类还没有示例数据。"
  />
</template>
