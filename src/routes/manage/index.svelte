<script lang="ts">
  import { session } from '$lib/stores'
</script>

<h1>Manage</h1>
<p>You're a seller!</p>
<a
  class="underline hover:text-orange-500 duration-75"
  href={`/u/${$session.seller.username}`}
>
  My page
</a>

<style>
</style>
