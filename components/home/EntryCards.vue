<script setup lang="ts">
import { getNavigationPath } from '~/utils/navigation'

const entries = [
  {
    index: '01',
    title: '境外银行卡',
    description: '境外银行、开户入口、资金流转',
    to: getNavigationPath('overseas-banks'),
  },
  {
    index: '02',
    title: '境外手机卡',
    description: '境外 SIM、eSIM、接码开户',
    to: getNavigationPath('overseas-sim'),
  },
  {
    index: '03',
    title: '港美股投资',
    description: '港美股券商、投资工具、出入金',
    to: getNavigationPath('overseas-brokers'),
  },
  {
    index: '04',
    title: '资金流转',
    description: '跨境汇款、多币种账户、资金路径',
    to: getNavigationPath('fund-transfer'),
  },
  {
    index: '05',
    title: '数字基建',
    description: '域名、Workspace、Cloudflare、DNSHE、海外邮箱',
    to: getNavigationPath('digital-infra'),
  },
]
</script>

<template>
  <section>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
