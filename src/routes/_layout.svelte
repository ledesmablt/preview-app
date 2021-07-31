<script lang="ts">
  import Nav from '../components/Nav.svelte'
  import { isAuthorized } from '../stores'

  export let segment: string | undefined
  interface NavLink {
    content: string
    href: string
    pageName?: string
  }
  let links: NavLink[] = [
    { content: 'home', href: '.', pageName: undefined },
    { content: 'form', href: 'form', pageName: 'form' },
    { content: 'about', href: 'about', pageName: 'about' }
  ]
  let adminLinks: NavLink[] = [
    ...links,
    {
      content: 'admin',
      href: 'admin',
      pageName: 'admin'
    }
  ]

  // persist admin tab if visited or logged in
  let isAdmin: boolean = false
  isAuthorized.subscribe((value) => {
    isAdmin = value || (segment ?? '').startsWith('admin')
  })
</script>

{#if isAdmin}
  <Nav {segment} bind:links={adminLinks} />
{:else}
  <Nav {segment} bind:links />
{/if}

<main>
  <slot />
</main>

<style>
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
