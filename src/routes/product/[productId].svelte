<script lang="ts" context="module">
  import type { LoadInput } from '@sveltejs/kit'
  import type { ProductPageQuery$input } from '$houdini'
  export function ProductPageQueryVariables({
    page
  }: LoadInput): ProductPageQuery$input {
    return {
      id: page.params.productId,
      fromShop: true
    }
  }
</script>

<script lang="ts">
  import { query, graphql } from '$houdini'
  import type { ProductPageQuery } from '$houdini'
  const { data: queryData } = query<ProductPageQuery>(graphql`
    query ProductPageQuery($id: String!, $fromShop: Boolean!) {
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
    }
  `)
  if (!$queryData.get_product?.id) {
    throw new Error('Product not found')
  }

  let { seller: querySeller, ...queryProduct } = $queryData.get_product!
  let product = { ...queryProduct }
  let seller = { ...querySeller }
</script>

<svelte:head>
  <title>{product.name} by {seller.username}</title>
</svelte:head>

<h1 class="text-2xl">{product.name}</h1>
<h2>by {seller.username}</h2>

<img
  class="max-w-lg my-4"
  src={product.imageUrl || undefined}
  alt={product.name || 'product'}
/>

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
