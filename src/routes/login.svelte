<script lang="ts">
  import { goto } from '$app/navigation'
  import { session } from '$app/stores'
  import { onMount } from 'svelte'
  $: authorized = $session.admin

  onMount(() => {
    if (authorized) {
      goto('/admin')
    }
  })

  let email: string
  let password: string

  async function onSubmit(e: Event) {
    if (!email || !password) {
      alert('both email and password required!')
    }
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      session.set({
        loaded: true,
        admin: { email }
      })
      goto('/admin')
    } else {
      session.set({
        loaded: true
      })
    }
  }
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

{#if !authorized}
  <h1 class="text-xl pb-4 font-semibold">Log In</h1>
  <form action="submit" on:submit|preventDefault={onSubmit}>
    <label for="email">Email</label>
    <input name="email" bind:value={email} />
    <label for="password">Password</label>
    <input name="password" type="password" bind:value={password} />
    <br />
    <button class="submit" type="submit">Log In</button>
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
</style>
