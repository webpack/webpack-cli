import esmModule from './static-esm-module';

const getLazyModule = () => System.import('./lazy-module');

setTimeout(() => {
  getLazyModule.then((modDefault) => {
    console.log(modDefault);
  });
}, 300);

console.log(esmModule);
