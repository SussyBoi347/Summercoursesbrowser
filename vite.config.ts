import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const execFileAsync = promisify(execFile)

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    {
      name: 'crawler-api',
      configureServer(server) {
        server.middlewares.use('/api/crawl-courses', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
            return
          }

          try {
            const { stdout } = await execFileAsync('node', ['scripts/crawl-courses.mjs'], {
              cwd: server.config.root,
            })

            server.ws.send({ type: 'full-reload' })
            res.statusCode = 200
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ ok: true, output: stdout.trim() }))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({
              error: error instanceof Error ? error.message : 'Crawler failed',
            }))
          }
        })
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
