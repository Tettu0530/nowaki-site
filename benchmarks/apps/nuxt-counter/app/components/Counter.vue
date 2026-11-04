<script setup lang="ts">
const props = withDefaults(defineProps<{ start?: number }>(), { start: 0 });
const n = ref(props.start);
</script>

<template>
  <button type="button" @click="n++">count: {{ n }}</button>
</template>
