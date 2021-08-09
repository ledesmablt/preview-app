<script lang="ts">
  import '$lib/styles/tailwind-output.css'
  import '$lib/styles/global.css'
  import Nav from '$lib/components/Nav.svelte'
</script>

<Nav />

<main>
  <slot />
</main>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
