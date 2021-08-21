<script lang="ts">
  import { goto } from '$app/navigation'
  import { session } from '$lib/stores'
  import { onMount } from 'svelte'
  import { validate } from '$lib/utils/validation/signup'
  import type { Validation } from '$lib/utils/validation/signup'
  import type {
    Auth_Signup_Post_Body,
    Auth_Signup_Post_Endpoint
  } from '$lib/types/api'
  import axios from 'axios'

  $: authorized = $session.seller
  onMount(() => {
    if (authorized) {
      goto('/manage')
    }
  })

  let formData: Auth_Signup_Post_Body = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  let fieldErrors: any = null
  let validation: Validation = {}
  let submissionError: string = ''

  $: {
    validation = validate(formData)
    fieldErrors = {
      username: formData.username && validation.errors?.username,
      email: formData.email && validation.errors?.email,
      password: formData.password && validation.errors?.password,
      confirmPassword:
        formData.confirmPassword && validation.errors?.confirmPassword
    }
  }
  $: submitDisabled =
    Object.values(fieldErrors).filter(Boolean).length > 0 || !validation.isValid

  async function onSubmit() {
    submissionError = ''
    const res = await axios.post('/graphql', {
      variables: formData,
      query: `mutation (
          $username: String!
          $email: String!
          $password: String!
          $confirmPassword: String!
        ) {
          seller_signup(
            username: $username,
            email: $email,
            password: $password,
            confirmPassword: $confirmPassword
          ) {
            token
            seller {
              id
              username
            }
          }
        }`
    })
    if (res.data.errors) {
      submissionError = res.data.errors[0].message
    } else {
      $session = { seller: res.data.data.seller_signup.seller }
      goto('/manage')
    }
  }
</script>

<svelte:head>
  <title>Sign Up</title>
</svelte:head>

{#if !authorized}
  <h1 class="text-xl pb-4 font-semibold">Sign Up</h1>
  <form action="submit" on:submit|preventDefault={onSubmit}>
    <label for="username">Username</label>
    <input
      name="username"
      bind:value={formData.username}
      placeholder="myusername"
    />
    {#if fieldErrors.username}
      <span class="error">{fieldErrors.username}</span>
    {/if}
    <label for="email">Email</label>
    <input
      name="email"
      bind:value={formData.email}
      placeholder="email@example.com"
    />
    {#if fieldErrors.email}
      <span class="error">{fieldErrors.email}</span>
    {/if}
    <label for="password">Password</label>
    <input name="password" type="password" bind:value={formData.password} />
    {#if fieldErrors.password}
      <span class="error">{fieldErrors.password}</span>
    {/if}
    <label for="confirmPassword">Confirm Password</label>
    <input
      name="confirmPassword"
      type="password"
      bind:value={formData.confirmPassword}
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
  .submit:disabled {
    @apply bg-orange-100;
  }
  .error {
    @apply text-red-600 text-xs mb-1;
  }
</style>
