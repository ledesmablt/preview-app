<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ page, fetch }) => {
    const id = page.params.productId
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variables: { id, fromShop: true },
        query: `query ($id: String!, $fromShop: Boolean!) {
          get_product(id: $id, fromShop: $fromShop) {
            id
            name
            description
            price
            currency
            imageUrl
            audioPreviewUrl
            seller {
              id
              username
              password
              email
              bio
              userImageUrl
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
    const product = res.data.get_product
    if (!product) {
      return {
        status: 404,
        error: new Error(`Product ${id} not found`)
      }
    }
    const { seller } = product
    return {
      props: {
        product,
        seller
      }
    }
  }
</script>

<script lang="ts">
  export let product: any
  export let seller: any
</script>

<svelte:head>
  <title>{product.name} by {seller.username}</title>
</svelte:head>

<h1 class="text-2xl">{product.name}</h1>
<h2>by {seller.username}</h2>

<img class="max-w-lg my-4" src={product.imageUrl} alt={product.name} />

<p>{product.price} {product.currency}</p>
<p>{product.description}</p>
<p>{product.audioPreviewUrl}</p>

<div class="mt-4">
  <button class="editBtn">Add to cart</button>
</div>

<style lang="postcss">
  .editBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
</style>
