<script lang="ts">
  import { session, page } from '$app/stores'
  import { goto } from '$app/navigation'

  interface NavLink {
    content: string
    href: string
  }

  let nonAdminLinks: NavLink[] = [
    { content: 'home', href: '/' },
    { content: 'form', href: '/form' },
    { content: 'about', href: '/about' }
  ]
  let adminLinks: NavLink[] = [
    ...nonAdminLinks,
    {
      content: 'manage',
      href: '/manage'
    }
  ]
  $: links = $session.admin ? adminLinks : nonAdminLinks
  $: pageUnderManage = $page.path.startsWith('/manage')

  async function logOut() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if (!res.ok) {
        throw new Error()
      } else {
        session.set({})
        if (pageUnderManage) {
          goto('/')
        }
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

<nav class="flex font-light border-b border-gray-250 px-4">
  <ul class="container">
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
  </ul>

  <span class="h-auto container inline-block self-center text-right">
    {#if $session.admin}
      <button class="authBtn" on:click={logOut}>log out</button>
    {:else}
      <button class="authBtn" on:click={() => goto('/login')}>log in</button>
    {/if}
  </span>
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

  .authBtn {
    @apply rounded-md px-3 py-1 text-sm font-light border border-gray-200 hover:bg-gray-100 transition duration-200;
  }
</style>
