<script lang="ts">
  import { goto } from '$app/navigation'
  import { sessionStore } from '$lib/stores'

  let email: string
  let password: string

  sessionStore.subscribe((s) => {
    if (!s.loading && s.admin) {
      goto('/admin')
    }
  })

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
      sessionStore.set({
        loading: false,
        admin: { email }
      })
    } else {
      sessionStore.set({
        loading: false,
        admin: null
      })
    }
  }
</script>

<svelte:head>
  <title>Log In</title>
</svelte:head>

<h1 class="text-xl pb-4 font-semibold">Log In</h1>
<form action="submit" on:submit|preventDefault={onSubmit}>
  <label for="email">Email</label>
  <input name="email" bind:value={email} />
  <label for="password">Password</label>
  <input name="password" type="password" bind:value={password} />
  <br />
  <button class="submit" type="submit">Log In</button>
</form>

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
