'use strict';

import argsToCamelCase from '../src/args-to-camel-case';

describe('args-to-camel-case helper', () => {
    it('converts arguments with multiple dashes to camel case', () => {
        const obj = {
            'multi-word-arg': true,
            'multi-word-arg-2': 'hello world',
            argument: 0,
        };
        const result = {
            multiWordArg: true,
            multiWordArg2: 'hello world',
            argument: 0,
        };
        expect(argsToCamelCase(obj)).toEqual(result);
    });
});
