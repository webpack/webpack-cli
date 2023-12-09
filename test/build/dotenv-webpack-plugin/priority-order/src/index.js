console.log("Hello from index.js");

// value from .env.example to be overridden by .env
console.log("process.env.PUBLIC_EXAMPLE_VARIABLE:", process.env.PUBLIC_EXAMPLE_VARIABLE);

// value from .env to be overridden by .env.[mode]
console.log("process.env.PUBLIC_ENV_VARIABLE:", process.env.PUBLIC_ENV_VARIABLE);

// value from .env.[mode] to be overridden by .env.local
console.log("process.env.PUBLIC_ENV_MODE_VARIABLE:", process.env.PUBLIC_ENV_MODE_VARIABLE);

// value from .env.local to be overridden by .env.[mode].local
console.log("process.env.PUBLIC_ENV_LOCAL_VARIABLE:", process.env.PUBLIC_ENV_LOCAL_VARIABLE);