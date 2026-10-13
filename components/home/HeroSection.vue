<script setup lang="ts">
import { SITE_HERO_INTRO_LINES } from '~/utils/site';
</script>

<template>
    <section
        class="hero-screen relative flex h-[min(14rem,calc(100svh-22rem))] min-h-[11.5rem] flex-col items-center justify-center overflow-hidden px-4 py-5 text-center sm:px-6 sm:py-6"
    >
        <div class="hero-waves pointer-events-none absolute inset-x-0 bottom-0 h-14 sm:h-20" aria-hidden="true">
            <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none">
                <path
                    d="M0 140 C180 100 320 170 500 130 C680 90 820 160 1000 120 C1180 80 1320 150 1440 110 L1440 200 L0 200 Z"
                    stroke="rgba(255,255,255,0.08)"
                    stroke-width="1"
                    fill="rgba(255,255,255,0.02)"
                />
                <path
                    d="M0 160 C220 120 360 180 560 145 C760 110 900 175 1100 140 C1260 115 1360 155 1440 135 L1440 200 L0 200 Z"
                    stroke="rgba(234,179,8,0.12)"
                    stroke-width="1"
                    fill="rgba(234,179,8,0.03)"
                />
                <path
                    d="M0 175 C200 155 400 190 640 165 C880 140 1100 185 1440 160 L1440 200 L0 200 Z"
                    stroke="rgba(255,255,255,0.06)"
                    stroke-width="1"
                    fill="none"
                />
            </svg>
        </div>

        <div class="hero-content relative z-10 mx-auto flex max-w-3xl flex-col items-center">
            <h1 class="font-serif text-3xl font-bold leading-none tracking-tight sm:text-4xl lg:text-5xl">
                <span class="text-white">Zhen</span>
                <span class="text-amber-400"> Invest</span>
            </h1>

            <p class="mt-3 max-w-lg text-sm leading-6 tracking-wide text-zinc-300 sm:mt-3.5 sm:text-[0.95rem] sm:leading-7">
                <span
                    v-for="(line, index) in SITE_HERO_INTRO_LINES"
                    :key="line"
                    class="block"
                    :class="index === 0 ? 'text-zinc-200' : 'mt-1 text-zinc-300'"
                >
                    {{ line }}
                </span>
            </p>
        </div>
    </section>
</template>

<style scoped>
.hero-screen {
    background:
        radial-gradient(ellipse 70% 55% at 72% 78%, rgba(210, 165, 80, 0.16), transparent 58%),
        radial-gradient(ellipse 50% 40% at 30% 20%, rgba(255, 255, 255, 0.08), transparent 55%),
        linear-gradient(180deg, #2a303a 0%, #343b47 48%, #2e3440 100%);
    color: #f4f4f5;
}

.hero-content {
    animation: hero-rise 0.9s ease-out both;
}

@keyframes hero-rise {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .hero-content {
        animation: none;
    }
}
</style>
