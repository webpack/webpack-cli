import { getRequire, safeTraverse } from '@webpack-cli/utils';

import { JSCodeshift, Node } from '../types/NodePath';

function replaceWithPath(j: JSCodeshift, p: Node, pathVarName: string): Node {
    const convertedPath: Node = j.callExpression(j.memberExpression(j.identifier(pathVarName), j.identifier('join'), false), [
        j.identifier('__dirname'),
        p.value as Node,
    ]);

    return convertedPath;
}

/**
 *
 * Transform which adds `path.join` call to `output.path` literals
 *
 * @param {Object} j - jscodeshift top-level import
 * @param {Node} ast - jscodeshift ast to transform
 * @returns {Node} ast - jscodeshift ast
 */
export default function (j: JSCodeshift, ast: Node): Node | void {
    const literalOutputPath: Node = ast
        .find(j.ObjectExpression)
        .filter((p: Node): boolean => safeTraverse(p, ['parentPath', 'value', 'key', 'name']) === 'output')
        .find(j.Property)
        .filter(
            (p: Node): boolean =>
                safeTraverse(p, ['value', 'key', 'name']) === 'path' && safeTraverse(p, ['value', 'value', 'type']) === 'Literal',
        );

    if (literalOutputPath) {
        let pathVarName = 'path';
        let isPathPresent = false;
        const pathDeclaration: Node = ast
            .find(j.VariableDeclarator)
            .filter((p: Node): boolean => safeTraverse(p, ['value', 'init', 'callee', 'name']) === 'require')
            .filter(
                (p: Node): boolean =>
                    safeTraverse(p, ['value', 'init', 'arguments']) &&
                    // TODO: to fix when we have proper typing (@types/jscodeshift)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (p.value as any).init.arguments.reduce((isPresent: boolean, a: Node): boolean => {
                        return (a.type === 'Literal' && a.value === 'path') || isPresent;
                    }, false),
            );

        if (pathDeclaration) {
            isPathPresent = true;
            pathDeclaration.forEach((p: Node): void => {
                pathVarName = safeTraverse(p, ['value', 'id', 'name']) as string;
            });
        }
        const finalPathName = pathVarName;
        literalOutputPath.find(j.Literal).replaceWith((p: Node): Node => replaceWithPath(j, p, finalPathName));

        if (!isPathPresent) {
            const pathRequire: Node = getRequire(j, 'path', 'path');
            return ast.find(j.Program).replaceWith((p: Node): Node => j.program([].concat(pathRequire).concat((p.value as Node).body)));
        }
    }

    return ast;
}
