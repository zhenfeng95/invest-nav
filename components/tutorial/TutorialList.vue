<script setup lang="ts">
import type { Tutorial } from '~/types/tutorial'

defineProps<{
  items: Tutorial[]
}>()
</script>

<template>
  <div v-if="items.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <TutorialCard
      v-for="item in items"
      :key="item.id"
      :tutorial="item"
    />
  </div>
  <EmptyState
    v-else
    title="暂无教程"
    description="这个分类还没有内容，后续会继续补充。"
  />
</template>
