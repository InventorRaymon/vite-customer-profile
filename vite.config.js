import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vitejs.dev/config/
export default defineConfig({
  // server : {
  //   proxy:{
  //     '/api': {
  //       target: "http://10.0.1.20:8083",
  //       changeOrigin : true,
  //       rewrite : (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main:'./index.html',
        config: './Baseurl.js'
      }
    }
  }
})