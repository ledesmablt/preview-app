<script lang="ts" context="module">
  import type { SellerPageQuery$input } from '$houdini'
  import type { LoadInput } from '@sveltejs/kit'
  export function SellerPageQueryVariables({
    page
  }: LoadInput): SellerPageQuery$input {
    return {
      username: page.params.sellerUsername,
      fromShop: true
    }
  }
</script>

<script lang="ts">
  import { query, mutation, graphql } from '$houdini'
  import type { SellerPageQuery } from '$houdini'
  import { page } from '$app/stores'
  import { session } from '$lib/stores'
  import FileUpload from '$lib/components/FileUpload.svelte'
  import type {
    UpdateSellerMutation,
    UpdateSellerMutation$input
  } from '$houdini'

  const { data: queryData } = query<SellerPageQuery>(graphql`
    query SellerPageQuery($username: String!, $fromShop: Boolean!) {
      get_seller(username: $username) {
        id
        email
        username
        bio
        userImageUrl
        products(fromShop: $fromShop) {
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
  let { products: queryProducts, ...querySeller } = $queryData.get_seller!
  if (!querySeller.id) {
    throw new Error(`Seller ${$page.params.sellerUsername} not found`)
  }

  const updateSellerMutation = mutation<UpdateSellerMutation>(graphql`
    mutation UpdateSellerMutation(
      $bio: String
      $email: String
      $userImageDraftId: String
    ) {
      update_seller(
        bio: $bio
        email: $email
        userImageDraftId: $userImageDraftId
      ) {
        id
        username
        bio
        email
      }
    }
  `)
  const userImageMutation = mutation(graphql`
    mutation SellerUserImageUploadMutation($contentType: String!) {
      fileUpload: upload_seller_draft_user_image(contentType: $contentType) {
        signedUrl
        fileUrl
        draftId
      }
    }
  `)

  let seller = { ...querySeller }
  let products = [...queryProducts.map((p) => ({ ...p }))]
  let userImageUrl = seller.userImageUrl || ''
  let userImageDraftId = ''
  let isEditing = false
  let isSaving = false
  let editFormData = {
    email: seller.email,
    bio: seller.bio
  }

  $: authorizedForPage =
    $session.seller?.username === $page.params.sellerUsername &&
    $page.params.sellerUsername

  function resetImage() {
    userImageUrl = seller.userImageUrl || ''
  }

  async function onSave() {
    const variables: UpdateSellerMutation$input = {
      ...editFormData,
      userImageDraftId
    }
    isSaving = true
    try {
      const result = await updateSellerMutation(variables)
      seller = { ...seller, ...result.update_seller, userImageUrl }
      userImageDraftId = ''
    } catch (err) {
      alert(err[0].message)
    } finally {
      isEditing = false
      isSaving = false
    }
  }
</script>

<svelte:head>
  <title>{seller.username}</title>
</svelte:head>

<div class="flex">
  <div class="flex flex-col float-left items-center mr-8">
    {#if userImageUrl}
      <img
        class="userImage"
        src={userImageUrl}
        alt={`${seller.username} display picture`}
      />
    {:else}
      <div class="userImage bg-gray-300" />
    {/if}
    {#if authorizedForPage && isEditing}
      <div class="editBtn">
        <FileUpload
          bind:newFileUrl={userImageUrl}
          bind:fileDraftId={userImageDraftId}
          mutationFunction={userImageMutation}
        >
          change
        </FileUpload>
      </div>
    {/if}
  </div>

  <div>
    <div class="flex flex-col max-w-md">
      <p>{seller.username}</p>
      {#if !isEditing}
        <p>{seller.email}</p>
        {#if seller.bio}
          <p>{seller.bio}</p>
        {/if}
      {:else}
        <input class="editField" bind:value={editFormData.email} />
        <textarea class="editField" bind:value={editFormData.bio} />
      {/if}
    </div>

    {#if authorizedForPage}
      <div>
        <button
          class="editBtn"
          class:cursor-wait={isSaving}
          disabled={isSaving}
          on:click={() => {
            isEditing = !isEditing
            if (!isEditing) {
              // on cancel reset image
              resetImage()
            }
          }}
        >
          {isEditing ? 'cancel' : 'edit'}
        </button>
        {#if isEditing}
          <button
            class="editBtn bg-gray-300"
            class:bg-gray-300={!isSaving}
            class:cursor-wait={isSaving}
            disabled={isSaving}
            on:click={onSave}>{isSaving ? 'saving...' : 'save'}</button
          >
        {/if}
      </div>
    {/if}
  </div>
</div>

<h2 class="mt-8 mb-2 text-xl">Products</h2>
<div>
  <div class="grid grid-cols-3 gap-y-10 gap-x-6">
    {#each products as product}
      <a href={`/product/${product.id}`}>
        <div class="rounded-lg aspect-w-1 aspect-h-1 mb-1">
          <img
            class="w-full object-cover hover:opacity-75 "
            src={product.imageUrl || undefined}
            alt={product.name || 'product image'}
          />
        </div>
        <h3>{product.name}</h3>
        <p>{product.price} {product.currency}</p>
      </a>
    {/each}
  </div>
</div>

<style lang="postcss">
  .userImage {
    @apply w-28 h-28 rounded-full object-cover;
  }
  .editBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
  .editField {
    @apply border border-gray-400 rounded mb-1 max-w-md;
  }
</style>
