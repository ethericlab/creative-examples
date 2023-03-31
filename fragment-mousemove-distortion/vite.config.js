const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

import glsl from 'vite-plugin-glsl'

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
        {
            host: true,
            open: !isCodeSandbox // Open if it's not a CodeSandbox
        },
    build:
        {
            outDir: '../dist',
            emptyOutDir: true,
            sourcemap: true
        },
    plugins: [
        glsl()
    ]
}