<script lang="ts">
  import { goto } from '$app/navigation'
  import { session } from '$app/stores'
  import { onMount } from 'svelte'
  import { validate } from '$lib/utils/validation/signup'
  import type { Validation } from '$lib/utils/validation/signup'
  import axios from 'axios'

  $: authorized = $session.seller
  onMount(() => {
    if (authorized) {
      goto('/manage')
    }
  })

  let email: string = ''
  let password: string = ''
  let confirmPassword: string = ''
  let fieldErrors: any = null
  let validation: Validation = {}
  let submissionError: string = ''

  $: {
    validation = validate({ email, password, confirmPassword })
    fieldErrors = {
      email: email && validation.errors?.email,
      password: password && validation.errors?.password,
      confirmPassword: confirmPassword && validation.errors?.confirmPassword
    }
  }
  $: submitDisabled =
    Object.values(fieldErrors).filter(Boolean).length > 0 || !validation.isValid

  async function onSubmit(e: Event) {
    submissionError = ''
    try {
      const res = await axios.post('/api/auth/signup', {
        email,
        password,
        confirmPassword
      })
      $session = { loaded: true, seller: res.data }
      goto('/manage')
    } catch (err) {
      submissionError = err.response?.data?.message
    }
  }
</script>

<svelte:head>
  <title>Sign Up</title>
</svelte:head>

{#if !authorized}
  <h1 class="text-xl pb-4 font-semibold">Sign Up</h1>
  <form action="submit" on:submit|preventDefault={onSubmit}>
    <label for="email">Email</label>
    <input name="email" bind:value={email} placeholder="email@example.com" />
    {#if fieldErrors.email}
      <span class="error">{fieldErrors.email}</span>
    {/if}
    <label for="password">Password</label>
    <input name="password" type="password" bind:value={password} />
    {#if fieldErrors.password}
      <span class="error">{fieldErrors.password}</span>
    {/if}
    <label for="confirmPassword">Confirm Password</label>
    <input
      name="confirmPassword"
      type="password"
      bind:value={confirmPassword}
    />
    {#if fieldErrors.confirmPassword}
      <span class="error">{fieldErrors.confirmPassword}</span>
    {/if}
    <br />
    <button class="submit" type="submit" disabled={submitDisabled}
      >Sign Up</button
    >
    {#if submissionError}
      <span class="error mt-4">Error: {submissionError}</span>
    {/if}
  </form>
{/if}

<style>
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
  .submit:disabled {
    @apply bg-orange-100;
  }
  .error {
    @apply text-red-600 text-xs mb-1;
  }
</style>
