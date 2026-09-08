<script setup lang="ts">
useHomeSeo()
</script>

<template>
  <div>
    <HeroSection />
    <AppContainer id="home-content" class="space-y-20 pb-20 pt-10 sm:space-y-24 sm:pb-24">
      <EntryCards />
      <PopularTutorials />
      <NavigationCategories />
      <PopularTools />
      <ResearchPreview />
    </AppContainer>
  </div>
</template>
