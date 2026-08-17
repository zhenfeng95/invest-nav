<script setup lang="ts">
import { getNavigationCategories } from '~/utils/navigation'

const categories = getNavigationCategories()

usePageSeo({
  title: '全部导航',
  description: '美股、加密货币、基金、ETF、个股、期权、香港银行、美股券商、资金流转与出入金导航。',
  path: '/nav',
})
</script>

<template>
  <AppContainer class="space-y-10 py-12 sm:py-16">
    <PageHero
      eyebrow="Navigation"
      title="全部导航"
      description="按分类查看经过整理的投资资源。不确定的官方链接会标记为 TODO，不会伪造地址。"
    />
    <div class="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
      <div class="flex min-w-max gap-4 sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-5">
        <NavigationCategory
          v-for="category in categories"
          :key="category.id"
          :category="category"
          class="w-64 sm:w-auto"
        />
      </div>
    </div>
  </AppContainer>
</template>
