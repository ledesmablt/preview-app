<script lang="ts">
  let formData = {
    firstName: 'Juan',
    lastName: 'dela Cruz',
    email: 'example@gmail.com'
  }

  let submissionStatus: string

  async function onSubmit(e: Event) {
    const res = await fetch('/form/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    submissionStatus = res.statusText
  }
</script>

<svelte:head>
  <title>Form</title>
</svelte:head>

<h1>Form</h1>

<form action="submit" on:submit|preventDefault={onSubmit} class="container">
  <label for="firstName">First name</label>
  <input name="firstName" bind:value={formData.firstName} />
  <label for="lastName">Last name</label>
  <input name="lastName" bind:value={formData.lastName} />
  <label for="email">Email</label>
  <input name="email" bind:value={formData.email} />
  <br />
  <button type="submit">Submit</button>
</form>

{#if submissionStatus}
  <p>{submissionStatus}</p>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: column;
    max-width: 500px;
  }
</style>
