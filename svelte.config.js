import preprocess from 'svelte-preprocess'
import houdini from 'houdini-preprocess'
import node from '@sveltejs/adapter-node'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [preprocess({ postcss: true }), houdini()],

  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: node(),
    vite: {
      resolve: {
        alias: {
          $houdini: path.resolve('.', '$houdini')
        }
      }
    }
  }
}

export default config
