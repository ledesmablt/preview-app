<script lang="ts">
  import { sessionStore } from '../../stores'
  import type { Session } from '../../stores'

  import { goto } from '@sapper/app'

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
