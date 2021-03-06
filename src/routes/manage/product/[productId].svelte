<script lang="ts" context="module">
  import type { ManageProductQuery$input } from '$houdini'
  import type { LoadInput } from '@sveltejs/kit'
  export function ManageProductQueryVariables({
    page
  }: LoadInput): ManageProductQuery$input {
    return {
      id: page.params.productId
    }
  }
</script>

<script lang="ts">
  import FileUpload from '$lib/components/FileUpload.svelte'
  import { goto } from '$app/navigation'
  import { query, mutation, graphql } from '$houdini'
  import { session } from '$lib/stores'
  import type {
    ManageProductQuery,
    UpdateProductMutation,
    DeleteProductMutation
  } from '$houdini'

  const { data: queryData } = query<ManageProductQuery>(graphql`
    query ManageProductQuery($id: String!) {
      get_product(id: $id) {
        id
        name
        description
        price
        currency
        enabled
        imageUrl
        sellerId
        audioPreviewUrl
        audioProductUrl
      }
    }
  `)
  const product = { ...$queryData.get_product }
  if (!product.id) {
    throw new Error('Product not found')
  } else if ($session.seller?.id !== product.sellerId) {
    throw new Error('Unauthorized')
  }

  let formData = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    currency: product.currency,
    enabled: !!product.enabled,
    imageDraftId: '',
    audioPreviewDraftId: '',
    audioProductDraftId: ''
  }
  export let imageUrl = product.imageUrl || ''
  export let audioPreviewUrl = product.audioPreviewUrl || ''
  export let audioProductUrl = product.audioProductUrl || ''

  const imageUploadMutation = mutation(graphql`
    mutation ProductImageUploadMutation($id: String!, $contentType: String!) {
      fileUpload: upload_product_draft_display_image(
        id: $id
        contentType: $contentType
      ) {
        signedUrl
        fileUrl
        draftId
      }
    }
  `)
  const audioPreviewUploadMutation = mutation(graphql`
    mutation ProductAudioPreviewUploadMutation(
      $id: String!
      $contentType: String!
    ) {
      fileUpload: upload_product_draft_audio_preview(
        id: $id
        contentType: $contentType
      ) {
        signedUrl
        fileUrl
        draftId
      }
    }
  `)
  const audioProductUploadMutation = mutation(graphql`
    mutation ProductAudioProductUploadMutation(
      $id: String!
      $contentType: String!
    ) {
      fileUpload: upload_product_draft_audio_product(
        id: $id
        contentType: $contentType
      ) {
        signedUrl
        fileUrl
        draftId
      }
    }
  `)
  const updateMutation = mutation<UpdateProductMutation>(graphql`
    mutation UpdateProductMutation(
      $id: String
      $name: String
      $description: String
      $price: Float
      $currency: String
      $enabled: Boolean
      $imageDraftId: String
      $audioPreviewDraftId: String
      $audioProductDraftId: String
    ) {
      update_product(
        id: $id
        name: $name
        description: $description
        price: $price
        currency: $currency
        enabled: $enabled
        imageDraftId: $imageDraftId
        audioPreviewDraftId: $audioPreviewDraftId
        audioProductDraftId: $audioProductDraftId
      ) {
        name
        description
        price
        currency
        enabled
      }
    }
  `)
  const deleteMutation = mutation<DeleteProductMutation>(graphql`
    mutation DeleteProductMutation($id: String!) {
      delete_product(id: $id)
    }
  `)

  let submissionError = ''
  let isSaving = false

  async function onSubmit() {
    try {
      isSaving = true
      const res = await updateMutation(formData)
      formData = { ...formData, ...res.update_product! }
      // update all storage urls in memory
      product.imageUrl = imageUrl
      product.audioPreviewUrl = audioPreviewUrl
      product.audioProductUrl = audioProductUrl
    } catch (err) {
      submissionError = err[0].message
    } finally {
      isSaving = false
    }
  }
  async function onDelete() {
    try {
      await deleteMutation({ id: product.id! })
      goto('/manage')
    } catch (err) {
      submissionError = err[0].message
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
      <label for="price">base price*</label>
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
  {#if audioProductUrl}
    <p>{audioProductUrl}</p>
  {/if}
  <div class="mb-2 flex space-x-2">
    <div class="editBtn">
      <FileUpload
        fileType="audioOrZip"
        body={{ id: product.id }}
        bind:newFileUrl={audioProductUrl}
        bind:fileDraftId={formData.audioProductDraftId}
        mutationFunction={audioProductUploadMutation}
      >
        upload product file
      </FileUpload>
    </div>
    {#if audioProductUrl}
      <button class="editBtn">delete product audio</button>
    {/if}
  </div>
  {#if audioPreviewUrl}
    <p>{audioPreviewUrl}</p>
  {/if}
  <div class="mb-2 flex space-x-2">
    <div class="editBtn">
      <FileUpload
        fileType="audio"
        body={{ id: product.id }}
        bind:newFileUrl={audioPreviewUrl}
        bind:fileDraftId={formData.audioPreviewDraftId}
        mutationFunction={audioPreviewUploadMutation}
      >
        upload preview audio
      </FileUpload>
    </div>
    {#if audioPreviewUrl}
      <button class="editBtn">delete preview audio</button>
    {/if}
  </div>
  <div class="mb-6">
    {#if imageUrl}
      <img src={imageUrl} alt="product" />
    {/if}
    <div class="flex space-x-2">
      <div class="editBtn">
        <FileUpload
          body={{ id: product.id }}
          bind:newFileUrl={imageUrl}
          bind:fileDraftId={formData.imageDraftId}
          mutationFunction={imageUploadMutation}
        >
          upload image
        </FileUpload>
      </div>
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

  <div class="text-xs mt-2 mb-4 italic">
    <p>* users have the option to pay more than the price you set</p>
  </div>
  <div class="flex">
    <button class="submit" class:cursor-wait={isSaving} disabled={isSaving}>
      {isSaving ? 'saving...' : 'save'}
    </button>
    <button
      class="ml-2 rounded border border-gray-200 px-4"
      class:cursor-wait={isSaving}
      disabled={isSaving}
      on:click={onDelete}
    >
      {isSaving ? 'deleting...' : 'delete'}
    </button>
  </div>
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

  .editBtn {
    @apply rounded border border-gray-200 px-2 mt-2;
  }
  .submit {
    @apply rounded bg-orange-300 w-max py-1 px-5 hover:bg-orange-500;
  }
  .error {
    @apply text-red-600 text-xs mb-1;
  }
</style>
