// import { dirname, resolve } from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
    mode: 'production',
    entry: './main.js',
    output: {
        path: './dist',
        filename: 'foo.bundle.js',
    },
};

export default config;
