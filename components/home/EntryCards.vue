<script setup lang="ts">
const entries = [
  {
    index: '01',
    title: '境外银行卡',
    description: '境外银行、开户入口、资金流转',
    to: '/nav/overseas-banks',
  },
  {
    index: '02',
    title: '境外手机卡',
    description: '境外 SIM、eSIM、接码开户',
    to: '/nav/overseas-sim',
  },
  {
    index: '03',
    title: '港美股投资',
    description: '港美股券商、投资工具、出入金',
    to: '/nav/overseas-brokers',
  },
  {
    index: '04',
    title: '我要买币',
    description: '交易平台、钱包、加密货币、资金流转',
    to: '/nav/crypto',
  },
]
</script>

<template>
  <section>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
