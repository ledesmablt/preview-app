<script lang="ts">
  import axios from 'axios'
  import { NO_CACHE } from '$lib/constants'

  export let isUploading: boolean = false
  export let body: Record<string, any> = {}
  export let endpoint: string
  export let onImagePreview: (previewImageUrl: string) => any = () => {}
  export let fileType = 'image'
  const fileExtensions: Record<string, string> = {
    image: '.jpg, .jpeg, .png',
    audio: '.m4a, .mp3, .wav, .aac, .flac'
  }
  fileExtensions.audioOrZip = fileExtensions.audio + ', .zip, .rar'
  let event: any

  let imageInput: HTMLElement
  type Response = { data?: { signedUrl?: string } }

  export async function saveImage() {
    if (!event?.target) {
      // return if no file
      return
    }

    isUploading = true
    const file = event.target?.files[0]
    if (!file) {
      isUploading = false
      return
    }
    const contentType = file.type
    try {
      const signedUrlRes = await axios.put<Response>(endpoint, {
        ...body,
        contentType
      })
      const signedUrl = signedUrlRes.data.data?.signedUrl
      if (!signedUrl) {
        throw new Error('API did not return signedUrl')
      }
      await axios({
        method: 'PUT',
        url: signedUrl,
        data: file,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': NO_CACHE
        }
      })
    } catch (err) {
      console.error(err)
    } finally {
      event.target.value = ''
      isUploading = false
    }
  }

  async function onFileChange(e: any) {
    e.preventDefault()
    event = e
    const file = event.target?.files[0]
    const contentType = file.type
    if (contentType.split('/')[0] === 'image') {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const previewImageUrl = e.target?.result as string
        onImagePreview(previewImageUrl)
      }
    }
  }
</script>

<div
  on:click={() => {
    imageInput.click()
  }}
>
  <label class="cursor-pointer" for="fileUpload"><slot /></label>
  <input
    type="file"
    name="fileUpload"
    accept={fileExtensions[fileType]}
    class="hidden"
    bind:this={imageInput}
    on:change={onFileChange}
  />
</div>
