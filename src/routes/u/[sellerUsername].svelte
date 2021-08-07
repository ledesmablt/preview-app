<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ page, fetch }) => {
    const username = page.params.sellerUsername
    const res = await fetch(`/api/seller?username=${username}`)
    const seller = (await res.json()).data
    if (!seller) {
      return {
        status: 404,
        error: new Error(`Seller ${username} not found`)
      }
    }
    return {
      props: {
        email: seller.email,
        bio: seller.bio,
        username: seller.username,
        userImageUrl: seller.userImageUrl
      }
    }
  }
</script>

<script lang="ts">
  import axios from 'axios'
  import { page } from '$app/stores'
  import { session } from '$lib/stores'

  $: authorizedForPage =
    $session.seller?.username === $page.params.sellerUsername &&
    $page.params.sellerUsername

  export let email: string
  export let bio: string
  export let username: string
  export let userImageUrl: string

  let imageInput: HTMLElement
  let isEdit = false
  let isSaving = false
  let editFormData = {
    email,
    bio,
    username
  }

  async function onImageChange(e: any) {
    e.preventDefault()
    const image: File = e.target?.files[0]
    const contentType = image.type
    const signedUrlRes = await axios.post('/api/seller/storage', {
      isPublic: true,
      filePath: 'userImage',
      contentType
    })
    const { signedUrl } = signedUrlRes.data
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
        userImageUrl = newImageUrl
      }
    } finally {
      e.target.value = ''
    }
  }
  async function onSave() {
    const changedValues = {
      email: editFormData.email !== email ? editFormData.email : undefined,
      username:
        editFormData.username !== username ? editFormData.username : undefined,
      bio: editFormData.bio !== bio ? editFormData.bio : undefined
    }
    if (Object.values(changedValues).filter(Boolean).length === 0) {
      // no changes
      isEdit = false
      return
    }
    isSaving = true
    await axios.put('/api/seller', changedValues)
    email = editFormData.email
    username = editFormData.username
    bio = editFormData.bio
    isEdit = false
    isSaving = false
  }
</script>

<svelte:head>
  <title>{username}</title>
</svelte:head>

<div class="flex flex-col float-left">
  {#if userImageUrl}
    <img
      class="userImage"
      src={userImageUrl}
      alt={`${username} display picture`}
    />
  {:else}
    <div class="userImage bg-gray-300" />
  {/if}
  {#if authorizedForPage}
    <div
      on:click={() => {
        imageInput.click()
      }}
    >
      <label class="cursor-pointer" for="userImageUpload">Upload image</label>
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
  <div class="flex flex-col">
    {#if !isEdit}
      <h1>{username}</h1>
      <p>{email}</p>
      {#if bio}
        <p>{bio}</p>
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
          isEdit = !isEdit
        }}
      >
        {isEdit ? 'cancel' : 'edit'}
      </button>
      {#if isEdit}
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

<style>
  .userImage {
    @apply w-24 h-24 rounded-full object-cover mr-8;
  }
  .editBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
  .editField {
    @apply border border-gray-400;
  }
</style>
