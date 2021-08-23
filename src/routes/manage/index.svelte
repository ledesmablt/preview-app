<script lang="ts" context="module">
  import type { ManagePageProductsQuery$input } from '$houdini'
  import type { LoadInput } from '@sveltejs/kit'
  export function ManagePageProductsQueryVariables({
    session
  }: LoadInput): ManagePageProductsQuery$input {
    if (!session.seller) {
      throw new Error('Unauthorized')
    }
    return {
      username: session.seller.username
    }
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation'
  import { session } from '$lib/stores'
  import { query, mutation, graphql } from '$houdini'
  import type { ManagePageProductsQuery, CreateProductMutation } from '$houdini'

  const { data: queryData } = query<ManagePageProductsQuery>(graphql`
    query ManagePageProductsQuery($username: String!) {
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
    }
  `)
  const createProductMutation = mutation<CreateProductMutation>(graphql`
    mutation CreateProductMutation {
      create_product {
        id
      }
    }
  `)

  let products = [
    ...($queryData.get_seller?.products || []).map((p) => ({ ...p }))
  ]

  async function onCreateProduct() {
    try {
      const res = await createProductMutation(null)
      goto(`/manage/product/${res.create_product!.id}`)
    } catch (err) {
      alert(err[0].message)
    }
  }
</script>

<h1 class="font-medium text-lg">Manage</h1>
<a
  class="underline hover:text-orange-500 duration-75"
  href={`/u/${$session?.seller?.username}`}
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
