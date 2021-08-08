<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  import type { Seller_Get_Endpoint } from '$lib/types/api'
  export const load: Load = async ({ page, fetch }) => {
    const username = page.params.sellerUsername
    const res: Seller_Get_Endpoint = await fetch(
      `/api/seller?username=${username}`
    ).then((r) => r.json())
    const seller = res.data
    if (!seller) {
      return {
        status: 404,
        error: new Error(`Seller ${username} not found`)
      }
    }
    return {
      props: {
        seller
      }
    }
  }
</script>

<script lang="ts">
  import axios from 'axios'
  import { page } from '$app/stores'
  import { session } from '$lib/stores'
  import { getChangedFields } from '$lib/utils/client'
  import type {
    Seller_Get_Data,
    Seller_Put_Body,
    Seller_Put_Endpoint,
    Seller_Storage_Post_Body,
    Seller_Storage_Post_Endpoint
  } from '$lib/types/api'

  $: authorizedForPage =
    $session.seller?.username === $page.params.sellerUsername &&
    $page.params.sellerUsername

  export let seller: Seller_Get_Data

  let imageInput: HTMLElement
  let isEditing = false
  let isSaving = false
  let editFormData: Seller_Put_Body = {
    email: seller.email,
    bio: seller.bio,
    username: seller.username
  }

  async function onImageChange(e: any) {
    e.preventDefault()
    const image: File = e.target?.files[0]
    const contentType = image.type
    const body: Seller_Storage_Post_Body = {
      isPublic: true,
      filePath: 'userImage',
      contentType
    }
    const signedUrlRes = await axios.post<Seller_Storage_Post_Endpoint>(
      '/api/seller/storage',
      body
    )
    const signedUrl = signedUrlRes.data.data?.signedUrl
    try {
      await axios({
        method: 'PUT',
        url: signedUrl,
        data: image,
        headers: {
          'Content-Type': contentType
        }
      })
      let reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string
        seller.userImageUrl = newImageUrl
      }
    } finally {
      e.target.value = ''
    }
  }
  async function onSave() {
    const changedValues = getChangedFields(editFormData, seller)
    if (Object.values(changedValues).filter(Boolean).length === 0) {
      // no changes
      isEditing = false
      return
    }
    isSaving = true
    const res = await axios.put<Seller_Put_Endpoint>(
      '/api/seller',
      changedValues
    )
    seller = { ...seller, ...res.data.data }
    isEditing = false
    isSaving = false
  }
</script>

<svelte:head>
  <title>{seller.username}</title>
</svelte:head>

<div class="flex flex-col float-left items-center mr-8">
  {#if seller.userImageUrl}
    <img
      class="userImage"
      src={seller.userImageUrl}
      alt={`${seller.username} display picture`}
    />
  {:else}
    <div class="userImage bg-gray-300" />
  {/if}
  {#if authorizedForPage && isEditing}
    <div
      class="editBtn"
      on:click={() => {
        imageInput.click()
      }}
    >
      <label class="cursor-pointer" for="userImageUpload">change</label>
      <input
        type="file"
        name="userImageUpload"
        accept=".jpg, .jpeg, .png"
        class="hidden"
        bind:this={imageInput}
        on:change={onImageChange}
      />
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
