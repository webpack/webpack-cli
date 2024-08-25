{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "strict": true,
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.js",
    "src/**/*.svelte"
  ],
  "exclude": [
    "node_modules"
  ]
}
