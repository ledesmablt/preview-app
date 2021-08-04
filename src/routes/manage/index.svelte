<script lang="ts">
  import { goto } from '$app/navigation'
  import { session } from '$app/stores'
  import { onMount } from 'svelte'

  $: authorized = !!$session.seller

  onMount(() => {
    if (!authorized) {
      goto('/login')
    }
  })
</script>

<svelte:head>
  <title>Manage</title>
</svelte:head>

{#if authorized}
  <h1>Manage</h1>
  <p>You're a seller!</p>
{/if}

<style>
</style>
