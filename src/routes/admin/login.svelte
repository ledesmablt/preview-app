<script lang="ts">
  import { goto } from '@sapper/app'
  import { isAuthorized } from '../../stores'

  let email: string
  let password: string

  isAuthorized.subscribe((val) => {
    if (val) {
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
      isAuthorized.set(true)
    } else {
      isAuthorized.set(false)
    }
  }
</script>

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
