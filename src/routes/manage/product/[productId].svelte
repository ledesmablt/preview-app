<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import type { Product_Get_Endpoint } from '$lib/types/api'
  export const load: Load = async ({ page, fetch, session }) => {
    const res: Product_Get_Endpoint = await fetch(
      `/api/products?id=${page.params.productId}`
    ).then((r) => r.json())
    const product = (res.data || [])[0]

    if (!product) {
      return {
        status: 404
      }
    }
    if (session.seller.id !== product.sellerId) {
      // product should be owned by seller
      return {
        status: 403
      }
    }
    return {
      props: {
        product
      }
    }
  }
</script>

<script lang="ts">
  import axios from 'axios'
  import type {
    Product_Get_Data_Element,
    Product_Put_Body,
    Product_Put_Endpoint
  } from '$lib/types/api'

  export let product: Product_Get_Data_Element
  let formData: Product_Put_Body = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    currency: product.currency,
    enabled: product.enabled
  }
  let submissionError = ''
  let isSaving = false

  async function onSubmit() {
    isSaving = true
    try {
      const res = await axios.put<Product_Put_Endpoint>(
        '/api/products',
        formData
      )
      formData = { ...formData, ...res.data.data }
    } catch (err) {
      submissionError = err.response.data.message
    } finally {
      isSaving = false
    }
  }
</script>

<form action="submit" on:submit|preventDefault={onSubmit}>
  <label for="name">name</label>
  <input class="inputField" name="name" bind:value={formData.name} />
  <label for="description">description</label>
  <textarea
    class=".inputField"
    name="description"
    bind:value={formData.description}
  />
  <div class="flex">
    <div class="flex flex-col flex-grow mr-2">
      <label for="price">base price</label>
      <input
        class="inputField"
        name="price"
        type="number"
        step={0.01}
        min={0.01}
        bind:value={formData.price}
      />
    </div>
    <div class="flex flex-col flex-grow ml-2">
      <label for="currency">currency</label>
      <input
        class="inputField"
        name="currency"
        bind:value={formData.currency}
      />
    </div>
  </div>
  <div class="flex items-center">
    <label for="enabled">enabled?</label>
    <input
      class="ml-2"
      name="enabled"
      type="checkbox"
      bind:checked={formData.enabled}
    />
  </div>

  <br />
  <button class="submit" class:cursor-wait={isSaving} disabled={isSaving}>
    {isSaving ? 'saving...' : 'save'}
  </button>
  {#if submissionError}
    <span class="error mt-4">Error: {submissionError}</span>
  {/if}
</form>

<style lang="postcss">
  form {
    @apply flex flex-col max-w-md;
  }
  .inputField,
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
