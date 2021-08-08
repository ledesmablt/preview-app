<script lang="ts">
  import axios from 'axios'
  import { goto } from '$app/navigation'
  import { session } from '$lib/stores'
  import type { Product } from '@prisma/client'

  let productList: Product[] = []
  let sellerUsername = $session?.seller?.username

  async function onCreateProduct() {
    const product = await axios.post('/api/product')
    const productId = product.data.data.id
    goto(`/manage/product/${productId}`)
  }
</script>

<h1>Manage</h1>
<p>You're a seller!</p>
<a
  class="underline hover:text-orange-500 duration-75"
  href={`/u/${sellerUsername}`}
>
  My page
</a>

<div class="my-3">
  <h2>products</h2>
  {#if productList.length === 0}
    <p class="ml-3">
      you don't have any products. click "create new" below to get started!
    </p>
  {:else}
    <ul>
      {#each productList as product}
        <li on:click={() => goto(`/manage/product/${product.id}`)}>
          {product.name}
        </li>
      {/each}
    </ul>
  {/if}
  <button class="createBtn" on:click={onCreateProduct}> create new </button>
</div>

<style>
  .createBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
</style>
