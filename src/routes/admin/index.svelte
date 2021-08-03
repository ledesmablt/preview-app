<script lang="ts">
  import { session } from '$app/stores'
  import { onMount } from 'svelte'

  import { goto } from '$app/navigation'

  let authorized: boolean
  session.subscribe((s) => {
    authorized = !!s.admin
  })

  onMount(() => {
    if (!authorized) {
      goto('/admin/login')
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
