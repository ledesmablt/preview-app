<script lang="ts" context="module">
  import type { Seller } from '@prisma/client'
  import type { Load } from '@sveltejs/kit'

  export const load: Load = async ({ page, fetch }) => {
    const username = page.params.sellerUsername
    const res = await fetch(`/api/seller?username=${username}`)
    const seller = (await res.json()).data as Partial<Seller>
    return {
      props: {
        email: seller.email,
        bio: seller.bio,
        username: seller.username
      }
    }
  }
</script>

<script lang="ts">
  export let email: string
  export let bio: string
  export let username: string
</script>

<svelte:head>
  <title>{username}</title>
</svelte:head>

<h1>{username}</h1>
<p>{email}</p>
{#if bio}
  <p>{bio}</p>
{/if}

<style>
</style>
