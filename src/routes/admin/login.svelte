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

<h1>Log In</h1>
<form action="submit" on:submit|preventDefault={onSubmit}>
  <label for="email">Email</label>
  <input name="email" bind:value={email} />
  <label for="password">Password</label>
  <input name="password" type="password" bind:value={password} />
  <br />
  <button type="submit">Log In</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
  }
</style>
