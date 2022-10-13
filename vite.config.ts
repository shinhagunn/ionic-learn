import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { IonicResolver, VueUseComponentsResolver, VueUseDirectiveResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'
import Unocss from 'unocss/vite'
import colors from './src/colors'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),
    Unocss(),
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
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        // 'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/store',
      ],
      vueTemplate: true,
    }),
    Components({
      directoryAsNamespace: true,
      resolvers: [
        IonicResolver(),
        VueUseComponentsResolver(),
        VueUseDirectiveResolver(),
      ],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
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
