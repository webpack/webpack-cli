async function load() {
    const value = await import (
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        './p.js'
    );
    
    console.log(value);
}

load();
