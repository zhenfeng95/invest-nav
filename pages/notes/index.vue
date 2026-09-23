<script setup lang="ts">
import { getNotes } from '~/utils/notes'

const notes = getNotes()

usePageSeo({
  title: '交易笔记｜规则、复盘与买卖纪律',
  description: 'Zhen Invest 交易笔记：持续整理交易规则、复盘方法、仓位节奏与买卖纪律，把交易拆成可检查的步骤。内容仅供学习交流，不构成投资建议。',
  path: '/notes',
})
</script>

<template>
  <AppContainer class="space-y-12 py-12 sm:py-16">
    <PageHero
      eyebrow="Notes"
      title="交易笔记"
      description="持续更新的方法与复盘要点：先把规则写死，再对照实盘检查。不是荐股，也不替代官方披露。"
    />
    <p class="text-sm text-zinc-400">共 {{ notes.length }} 篇</p>
    <NoteList :items="notes" />
  </AppContainer>
</template>
