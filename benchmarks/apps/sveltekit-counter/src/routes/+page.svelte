<script lang="ts">
  import Counter from "../lib/Counter.svelte";
</script>

<main style="font-family: sans-serif; max-width: 40rem; margin: 4rem auto">
  <h1>Hello from SvelteKit</h1>
  <p>Server-rendered page with one interactive island.</p>
  <Counter start={0} />
</main>
