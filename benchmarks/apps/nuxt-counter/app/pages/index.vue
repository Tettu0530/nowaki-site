<script setup lang="ts">
useHead({ title: "Counter — Nuxt", htmlAttrs: { lang: "en" } });
</script>

<template>
  <main style="font-family: sans-serif; max-width: 40rem; margin: 4rem auto">
    <h1>Hello from Nuxt</h1>
    <p>Server-rendered page with one interactive island.</p>
    <Counter :start="0" />
  </main>
</template>
