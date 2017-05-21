module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [
                    'style',
                    'css?modules&importLoaders=1&string=test123'
                ],
                include: path.join(__dirname, 'src')
            }
        ]
    }
}
