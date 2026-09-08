<script setup lang="ts">
import type { NavigationItem } from '~/types/navigation'
import { sortNavigationItems } from '~/utils/navigation'

const props = defineProps<{
  items: NavigationItem[]
}>()

const sortedItems = computed(() => sortNavigationItems(props.items))
</script>

<template>
  <div v-if="sortedItems.length" class="grid gap-0 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <NavigationCard
      v-for="item in sortedItems"
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
