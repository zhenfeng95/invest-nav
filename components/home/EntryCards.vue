<script setup lang="ts">
const entries = [
  {
    index: '01',
    title: '我要开港卡',
    description: '香港银行、港卡开户、资金流转',
    to: '/nav/hk-banks',
  },
  {
    index: '02',
    title: '港美股投资',
    description: '港美股券商、投资工具、出入金',
    to: '/nav/us-brokers',
  },
  {
    index: '03',
    title: '我要买币',
    description: '交易平台、钱包、加密货币、资金流转',
    to: '/nav/crypto',
  },
]
</script>

<template>
  <section>
    <div class="grid gap-4 md:grid-cols-3">
      <EntryCard
        v-for="entry in entries"
        :key="entry.to"
        :index="entry.index"
        :title="entry.title"
        :description="entry.description"
        :to="entry.to"
      />
    </div>
  </section>
</template>
