<script lang="ts">
  let { start = 0 }: { start?: number } = $props();
  let n = $state(start);
</script>

<button type="button" onclick={() => n++}>count: {n}</button>
