<script lang="ts">
  import { mutation, graphql, SellerLogin } from '$houdini'
  import { goto } from '$app/navigation'
  import { session } from '$lib/stores'
  import { onMount } from 'svelte'

  $: authorized = $session.seller

  onMount(() => {
    if (authorized) {
      goto('/manage')
    }
  })

  let formData = {
    emailOrUsername: '',
    password: ''
  }
  let submissionError: string = ''
  const loginMutation = mutation<SellerLogin>(graphql`
    mutation SellerLogin($emailOrUsername: String!, $password: String!) {
      seller_login(emailOrUsername: $emailOrUsername, password: $password) {
        token
        seller {
          id
          username
        }
      }
    }
  `)

  async function onSubmit() {
    try {
      const res = await loginMutation(formData)
      $session = { seller: res!.seller_login!.seller }
      goto('/manage')
    } catch (err) {
      submissionError = err[0].message
    }
  }
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

{#if !authorized}
  <h1 class="text-xl pb-4 font-semibold">Log In</h1>
  <form action="submit" on:submit|preventDefault={onSubmit}>
    <label for="emailOrUsername">Email or username</label>
    <input name="emailOrUsername" bind:value={formData.emailOrUsername} />
    <label for="password">Password</label>
    <input name="password" type="password" bind:value={formData.password} />
    <br />
    <button class="submit" type="submit">Log In</button>
    {#if submissionError}
      <span class="error mt-4">Error: {submissionError}</span>
    {/if}
  </form>
{/if}

<style lang="postcss">
  form {
    @apply flex flex-1 flex-col max-w-md;
  }
  label {
    @apply py-1;
  }
  input {
    @apply border rounded px-2 py-1 mb-1 text-sm;
  }

  .submit {
    @apply rounded bg-orange-300 w-max py-1 px-5 hover:bg-orange-500;
  }
  .error {
    @apply text-red-600 text-xs mb-1;
  }
</style>
