<script setup lang="ts">
useHomeSeo()
</script>

<template>
  <div>
    <HeroSection />
    <AppContainer id="home-content" class="space-y-20 pb-20 pt-8 sm:space-y-24 sm:pb-24 sm:pt-10">
      <MarketDaily />
      <NavigationCategories />
      <PopularTutorials />
      <PopularTools />
    </AppContainer>
  </div>
</template>
