<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ page, fetch }) => {
    const res = await fetch(`/api/product?id=${page.params.productId}`).then(
      (r) => r.json()
    )
    const { id, name } = res.data
    return {
      props: {
        id,
        name
      }
    }
  }
</script>

<script lang="ts">
  export let id: string
  export let name: string
</script>

<h2>{name}</h2>

<style>
</style>
