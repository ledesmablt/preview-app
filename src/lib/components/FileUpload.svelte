<script lang="ts">
  import axios from 'axios'
  import { NO_CACHE } from '$lib/constants'

  type FileType = 'image' | 'audio' | 'audioOrZip'

  export let newFileUrl: string
  export let isUploading: boolean = false
  export let body: Record<string, any> = {}
  export let fileType: FileType = 'image'
  export let fileDraftId: string = ''
  export let mutation: string

  const fileExtensions: Record<FileType, string> = {
    image: '.jpg, .jpeg, .png',
    audio: '.m4a, .mp3, .wav, .aac, .flac',
    audioOrZip: ''
  }
  fileExtensions.audioOrZip = fileExtensions.audio + ', .zip, .rar'

  let imageInput: HTMLElement

  async function onFileChange(event: any) {
    event.preventDefault()
    const file: File = event.target?.files[0]
    if (!file) {
      return
    }
    const contentType = file.type
    try {
      isUploading = true
      const signedUrlRes = await axios.post('/graphql', {
        variables: { ...body, contentType },
        query: mutation
      })
      const { signedUrl, fileUrl, draftId } = signedUrlRes.data.data.fileUpload
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
      if (fileUrl) {
        newFileUrl = fileUrl
      }
      if (draftId) {
        fileDraftId = draftId
      }
    } catch (err) {
      console.error(err)
    } finally {
      event.target.value = ''
      isUploading = false
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
