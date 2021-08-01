<script lang="ts">
  import { sessionStore } from '$lib/stores'
  import type { Session } from '$lib/stores'

  import { goto } from '$app/navigation'

  let authorized: boolean
  let session: Partial<Session> = { loading: true }
  sessionStore.subscribe((s) => {
    authorized = !!s.admin
    session = s
  })

  $: {
    if (!authorized && !session.loading) {
      goto('/admin/login')
    }
  }
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>

{#if session.loading}
  <p>loading...</p>
{:else}
  <h1>Admin</h1>
  {#if authorized}
    <p>you're an admin!</p>
  {/if}
{/if}

<style>
</style>
