import path from 'path';

export default [{
    resolve: {
        modules: [path.resolve('/src')]
    }
}, {
    resolve: {
        modules: [path.resolve('/src')]
    }
}, {
    resolve: {
        modules: [path.resolve('/src'), 'node_modules']
    }
}, {
    resolve: {
        modules: ['node_modules', path.resolve('/src')]
    }
}];
