<script lang="ts" context="module">
  import _ from 'lodash'
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ page, fetch }) => {
    const username = page.params.sellerUsername
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        variables: { username, fromShop: true },
        query: `query ($username: String!, $fromShop: Boolean!) {
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
        }`
      })
    }).then((r) => r.json())
    if (res.errors) {
      return {
        status: 400,
        error: new Error(res.errors[0].message)
      }
    }
    const seller = res.data.get_seller
    if (!seller) {
      return {
        status: 404,
        error: new Error(`Seller ${username} not found`)
      }
    }
    const products = seller.products
    return {
      props: {
        seller,
        products
      }
    }
  }
</script>

<script lang="ts">
  import axios from 'axios'
  import { page } from '$app/stores'
  import { session } from '$lib/stores'
  import { getChangedFields } from '$lib/utils/client'
  import FileUpload from '$lib/components/FileUpload.svelte'

  $: authorizedForPage =
    $session.seller?.username === $page.params.sellerUsername &&
    $page.params.sellerUsername

  export let seller: any
  export let products: any

  const userImageMutation = `mutation ($contentType: String!) {
    fileUpload: upload_seller_draft_user_image(contentType: $contentType) {
      signedUrl
      fileUrl
      draftId
    }
  }`
  let userImageUrl = seller.userImageUrl || ''
  let userImageDraftId = ''
  let isEditing = false
  let isSaving = false
  let editFormData = {
    email: seller.email,
    bio: seller.bio,
    username: seller.username
  }

  function resetImage() {
    userImageUrl = seller.userImageUrl || ''
  }

  async function onSave() {
    const changedValues = getChangedFields(editFormData, seller)
    if (userImageDraftId) {
      changedValues.userImageDraftId = userImageDraftId
    }
    isSaving = true
    const res = await axios.post('/graphql', {
      variables: changedValues,
      query: `mutation (
        $username: String,
        $bio: String,
        $email: String,
        $password: String,
        $userImageDraftId: String
      ) {
        update_seller(
          username: $username,
          bio: $bio,
          email: $email,
          password: $password,
          userImageDraftId: $userImageDraftId
        ) {
          id
          username
          bio
          email
          password
        }
      }`
    })
    if (res.data.errors) {
      console.error(res)
      alert(res.data.errors[0].message)
    }
    seller = {
      ...seller,
      ..._.pickBy(res.data.data.update_seller, (v) => v !== null)
    }
    seller.userImageUrl = userImageUrl
    userImageDraftId = ''
    isEditing = false
    isSaving = false
  }
</script>

<svelte:head>
  <title>{seller.username}</title>
</svelte:head>

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
        endpoint="/api/seller/storage/userImage"
        bind:newFileUrl={userImageUrl}
        bind:fileDraftId={userImageDraftId}
        mutation={userImageMutation}
      >
        change
      </FileUpload>
    </div>
  {/if}
</div>

<div>
  <div class="flex flex-col max-w-md">
    {#if !isEditing}
      <p>{seller.username}</p>
      <p>{seller.email}</p>
      {#if seller.bio}
        <p>{seller.bio}</p>
      {/if}
    {:else}
      <input class="editField" bind:value={editFormData.username} />
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

<h2 class="mt-6 mb-2 text-xl">Products</h2>
<div>
  <div class="grid grid-cols-3 gap-y-10 gap-x-6">
    {#each products as product}
      <a href={'#'}>
        <div class="rounded-lg aspect-w-1 aspect-h-1 mb-1">
          <img
            class="w-full object-cover hover:opacity-75 "
            src={product.imageUrl || undefined}
            alt={product.name}
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
    @apply w-24 h-24 rounded-full object-cover;
  }
  .editBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
  .editField {
    @apply border border-gray-400 rounded mb-1 max-w-md;
  }
</style>
