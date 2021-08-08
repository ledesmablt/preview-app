<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ page, fetch, session }) => {
    const res = await fetch(`/api/product?id=${page.params.productId}`).then(
      (r) => r.json()
    )
    const product = res.data
    // product should be owned by seller
    if (session.seller.id !== product.sellerId) {
      return {
        status: 403
      }
    }
    return {
      props: {
        id: product.id,
        name: product.name,
        description: product.description ?? ''
      }
    }
  }
</script>

<script lang="ts">
  import axios from 'axios'

  export let id: string
  export let name: string
  export let description: string

  let formData = {
    id,
    name,
    description
  }
  let submissionError = ''
  async function onSubmit() {
    const res = await axios.put('/api/product', formData)
    console.log(res)
  }
</script>

<form action="submit" on:submit|preventDefault={onSubmit}>
  <label for="name">name</label>
  <input name="name" bind:value={formData.name} />
  <label for="description">description</label>
  <textarea name="description" bind:value={formData.description} />

  <br />
  <button class="submit" type="submit">save</button>
  {#if submissionError}
    <span class="error mt-4">Error: {submissionError}</span>
  {/if}
</form>

<style lang="postcss">
  form {
    @apply flex flex-col max-w-md;
  }
  input,
  textarea {
    @apply border rounded px-2 py-1 mb-2 text-sm;
  }

  .submit {
    @apply rounded bg-orange-300 w-max py-1 px-5 hover:bg-orange-500;
  }
  .error {
    @apply text-red-600 text-xs mb-1;
  }
</style>
