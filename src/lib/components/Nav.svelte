<script lang="ts">
  import { session } from '$app/stores'
  import { page } from '$app/stores'

  let isAdmin: boolean = false
  session.subscribe((s) => {
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

  session.subscribe((s) => {
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
        session.set({
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

<nav class="font-light border-b border-gray-250 px-4">
  <ul>
    {#each links as link}
      <li class="block float-left">
        <a
          class="no-underline px-2 py-4 block"
          aria-current={isCurrentPage(link.href, $page.path)}
          href={link.href}
        >
          {link.content}
        </a>
      </li>
    {/each}

    {#if authorized}
      <button on:click={logOut}>Log Out</button>
    {/if}
  </ul>
</nav>

<style>
  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
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
    /* TODO: align with theme */
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -1px;
  }
</style>
