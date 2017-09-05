import esmModule from './static-esm-module';

const getLazyModule = () => System.import('./lazy-module');

setTimeout(() => {
  getLazyModule.then((modDefault) => {
    console.log(modDefault); //eslint-disable-line
  });
}, 300);

console.log(esmModule); //eslint-disable-line
