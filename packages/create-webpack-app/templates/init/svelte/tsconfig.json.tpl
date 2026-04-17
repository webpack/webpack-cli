{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "moduleResolution": "bundler",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "isolatedModules": true,
    "rewriteRelativeImportExtensions": true,
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
