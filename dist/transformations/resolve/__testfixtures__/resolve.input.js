import path from 'path';

export default [{
    resolve: {
        root: path.resolve('/src')
    }
}, {
    resolve: {
        root: [path.resolve('/src')]
    }
}, {
    resolve: {
        root: [path.resolve('/src'), 'node_modules']
    }
}, {
    resolve: {
        root: path.resolve('/src'),
        modules: ['node_modules']
    }
}];
