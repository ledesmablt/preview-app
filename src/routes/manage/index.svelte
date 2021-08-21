<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ session, fetch }) => {
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variables: { username: session.seller?.username },
        query: `query ($username: String!) {
          get_seller(username: $username) {
            products {
              id
              name
              price
              currency
              enabled
              imageUrl
            }
          }
        }`
      })
    }).then((r) => r.json())
    if (res.errors) {
      return {
        status: 400,
        error: new Error(res.errors[0].message)
      }
    }
    const products = res.data.get_seller?.products || []
    return {
      props: {
        products
      }
    }
  }
</script>

<script lang="ts">
  import axios from 'axios'
  import { goto } from '$app/navigation'
  import { session } from '$lib/stores'
  import type { Product_Get_Data, Product_Post_Endpoint } from '$lib/types/api'

  export let products: Product_Get_Data = []
  let sellerUsername = $session?.seller?.username

  async function onCreateProduct() {
    const res = await axios.post<Product_Post_Endpoint>('/api/products')
    const productId = res.data.data?.id
    if (!productId) {
      throw new Error('Something went wrong!')
    }
    goto(`/manage/product/${productId}`)
  }
</script>

<h1 class="font-medium text-lg">Manage</h1>
<a
  class="underline hover:text-orange-500 duration-75"
  href={`/u/${sellerUsername}`}
>
  my page
</a>

<div class="my-3">
  <h2 class="font-medium">products</h2>
  {#if products.length === 0}
    <p class="ml-3">
      you don't have any products. click "create new" below to get started!
    </p>
  {:else}
    <ul>
      {#each products as product}
        <li
          class="cursor-pointer ml-2"
          on:click={() => goto(`/manage/product/${product.id}`)}
        >
          {product.name}
        </li>
      {/each}
    </ul>
  {/if}
  <button class="createBtn" on:click={onCreateProduct}> create new </button>
</div>

<style lang="postcss">
  .createBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
</style>
