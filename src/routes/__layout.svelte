<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import Nav from '$lib/components/Nav.svelte'
  import { sessionStore } from '$lib/stores'

  onMount(async () => {
    const res = await fetch('/api/auth/')
    if (res.ok) {
      const admin = await res.json()
      sessionStore.set({ loading: false, admin })
    } else {
      sessionStore.set({
        loading: false
      })
    }
  })
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
