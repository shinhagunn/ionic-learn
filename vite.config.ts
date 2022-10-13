import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'
import colors from './src/colors'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	plugins: [
		vue(),
		WindiCSS(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
			manifest: {
				name: 'Campion',
				short_name: 'Campion',
				description: 'Simple PWA Music App',
				theme_color: '#1f1e33',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
	],
	css: {
    preprocessorOptions: {
      less: {
        additionalData: (function () {
          let variables = ''

          for (const key in colors) {
            const variable = `@${key}`
            const color = (colors as unknown as { [key: string]: string })[key]

            variables += `${variable}: ${color};\n`
          }

          return variables
        }()),
      },
    },
  },
	// Dev server setting
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
})
