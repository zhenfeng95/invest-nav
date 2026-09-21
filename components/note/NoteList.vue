<script setup lang="ts">
import type { Note } from '~/types/note'

defineProps<{
  items: Note[]
}>()
</script>

<template>
  <div v-if="items.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <NoteCard
      v-for="item in items"
      :key="item.id"
      :note="item"
    />
  </div>
  <EmptyState
    v-else
    title="暂无笔记"
    description="这个栏目会持续补充交易方法与复盘要点。"
  />
</template>
