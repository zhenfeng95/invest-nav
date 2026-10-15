<script setup lang="ts">
useHomeSeo()
</script>

<template>
  <div>
    <HeroSection />
    <AppContainer id="home-content" class="space-y-12 pb-20 pt-6 sm:space-y-14 sm:pb-24 sm:pt-8">
      <HomeWeeklySpotlight />
      <MarketDaily />
      <NavigationCategories />
      <PopularTutorials />
      <PopularTools />
    </AppContainer>
  </div>
</template>

