import { parseTopScope, findRootNodesByName, addProperty, removeProperty, parseMerge, safeTraverse } from './ast-utils';
import { JSCodeshift, Node, valueType } from './types/NodePath';

import logger from 'webpack-cli/lib/utils/logger';

export function recursiveTransform(j: JSCodeshift, ast: Node, key: string, value: valueType, action: string): boolean | Node {
    if (key === 'topScope') {
        if (Array.isArray(value)) {
            return parseTopScope(j, ast, value, action);
        }
        logger.error('Error in parsing top scope, Array required');
        return false;
    } else if (key === 'merge') {
        if (Array.isArray(value)) {
            return parseMerge(j, ast, value, action);
        }
    }
    const node: Node = findRootNodesByName(j, ast, key);

    // get module.exports prop
    const root = ast
        .find(j.ObjectExpression)
        .filter((p: Node): boolean => {
            return (
                safeTraverse(p, ['parentPath', 'value', 'left', 'object', 'name']) === 'module' &&
                safeTraverse(p, ['parentPath', 'value', 'left', 'property', 'name']) === 'exports'
            );
        })
        .filter((p: Node): boolean => !!(p.value as Node).properties);

    if (node.size() !== 0) {
        if (action === 'add') {
            return findRootNodesByName(j, root, key).forEach((p: Node): void => {
                j(p).replaceWith(addProperty(j, p, key, value, action));
            });
        } else if (action === 'remove') {
            return removeProperty(j, root, key, value);
        }
    } else {
        return root.forEach((p: Node): void => {
            if (value) {
                // init, add new property
                addProperty(j, p, key, value, null);
            }
        });
    }
}

export default recursiveTransform;
