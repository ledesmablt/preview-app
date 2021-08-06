<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ page, fetch }) => {
    const username = page.params.sellerUsername
    const res = await fetch(`/api/seller?username=${username}`)
    const seller = (await res.json()).data
    return {
      props: {
        email: seller.email,
        bio: seller.bio,
        username: seller.username,
        userImageUrl: seller.userImageUrl
      }
    }
  }
</script>

<script lang="ts">
  export let email: string
  export let bio: string
  export let username: string
  export let userImageUrl: string
</script>

<svelte:head>
  <title>{username}</title>
</svelte:head>

{#if userImageUrl}
  <img
    class="w-24 h-24 rounded-full object-cover mr-8 float-left"
    src={userImageUrl}
    alt={`${username} display picture`}
  />
{/if}
<h1>{username}</h1>
<p>{email}</p>
{#if bio}
  <p>{bio}</p>
{/if}

<style>
</style>
