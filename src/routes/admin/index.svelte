<script lang="ts">
  import { sessionStore } from '../../stores'
  import type { Session } from '../../stores'

  import { goto } from '@sapper/app'

  let authorized: boolean
  let session: Partial<Session> = {}
  sessionStore.subscribe((s) => {
    authorized = !!s.admin
    session = s
  })

  $: {
    if (!authorized && !session.loading) {
      goto('/admin/login')
    }
  }

  // TODO: dummy function; this should be at the top app level somehow
  async function checkAuthorized(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!session.loading) {
        resolve(!!session.admin)
      }
      if (!authorized) {
        setTimeout(() => {
          sessionStore.set({
            loading: false,
            admin: null
          })
          resolve(false)
        }, 200)
      } else {
        resolve(true)
      }
    })
  }

  let promise: Promise<boolean> = checkAuthorized()
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>

{#await promise}
  <p>loading...</p>
{:then}
  <h1>Admin</h1>
  {#if authorized}
    <p>you're an admin!</p>
  {/if}
{:catch err}
  {console.log(err)}
  <p>Something went wrong!</p>
{/await}

<style>
</style>
