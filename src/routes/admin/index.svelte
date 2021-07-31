<script lang="ts">
  import { isAuthorized } from '../../stores'
  import { goto } from '@sapper/app'

  let authorized: boolean = false
  isAuthorized.subscribe((val) => {
    authorized = val
  })

  // TODO: dummy function; this should be at the top app level somehow
  async function checkAuthorized(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!authorized) {
        setTimeout(() => {
          isAuthorized.update(() => authorized)
          resolve(authorized)
        }, 200)
      } else {
        resolve(true)
      }
    })
  }

  let promise: Promise<boolean> = checkAuthorized().then((val) => {
    if (!val) {
      goto('/admin/login')
    }
    return val
  })
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
{:catch}
  <p>Something went wrong!</p>
{/await}

<style>
</style>
