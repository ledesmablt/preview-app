<script lang="ts">
  import { onMount } from 'svelte'
  import Nav from '../components/Nav.svelte'
  import { sessionStore } from '../stores'

  onMount(async () => {
    const res = await fetch('/api/auth/')
    if (res.ok) {
      const admin = await res.json()
      sessionStore.set({ loading: false, admin })
    } else {
      sessionStore.set({
        loading: false
      })
    }
  })

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
  sessionStore.subscribe((s) => {
    isAdmin = !!s.admin || (segment ?? '').startsWith('admin')
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
