<script lang="ts">
  import { goto } from '$app/navigation'
  import { session } from '$app/stores'
  import { onMount } from 'svelte'

  $: authorized = !!$session.admin

  onMount(() => {
    if (!authorized) {
      goto('/login')
    }
  })
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>

{#if authorized}
  <h1>Admin</h1>
  <p>you're an admin!</p>
{/if}

<style>
</style>
