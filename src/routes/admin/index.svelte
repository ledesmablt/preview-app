<script lang="ts">
  import { isAuthorized } from '../../stores'

  async function checkAuthorized(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        isAuthorized.update(() => true)
        resolve(true)
      }, 1000)
    })
  }

  let authorized: Promise<boolean> = checkAuthorized()
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>

{#await authorized}
  <p>loading...</p>
{:then}
  <h1>Admin</h1>
{:catch error}
  <p>log in first</p>
{/await}

<style>
</style>
