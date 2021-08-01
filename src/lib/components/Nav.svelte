<script lang="ts">
  import { sessionStore } from '$lib/stores'
  import { page } from '$app/stores'

  let isAdmin: boolean = false
  sessionStore.subscribe((s) => {
    isAdmin = !!s.admin || $page.path.startsWith('/admin')
  })

  interface NavLink {
    content: string
    href: string
  }
  let links: NavLink[] = [
    { content: 'home', href: '/' },
    { content: 'form', href: '/form' },
    { content: 'about', href: '/about' }
  ]
  let adminLinks: NavLink[] = [
    ...links,
    {
      content: 'admin',
      href: '/admin'
    }
  ]
  if (isAdmin) {
    links = adminLinks
  }

  let authorized: boolean

  sessionStore.subscribe((s) => {
    authorized = !!s.admin
  })

  async function logOut() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if (!res.ok) {
        throw new Error()
      } else {
        sessionStore.set({
          loading: false,
          admin: null
        })
      }
    } catch (err) {
      alert('something went wrong!')
    }
  }

  function isCurrentPage(href: string, path: string): 'page' | undefined {
    if (href === '/') {
      return href === path ? 'page' : undefined
    }
    return path.startsWith(href) ? 'page' : undefined
  }
</script>

<nav>
  <ul>
    {#each links as link}
      <li>
        <a aria-current={isCurrentPage(link.href, $page.path)} href={link.href}
          >{link.content}</a
        >
      </li>
    {/each}

    {#if authorized}
      <button on:click={logOut}>Log Out</button>
    {/if}
  </ul>
</nav>

<style>
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }

  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
</style>
