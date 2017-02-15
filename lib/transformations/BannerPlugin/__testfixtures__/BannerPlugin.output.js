module.exports = {
    plugins: [
        new webpack.BannerPlugin({
            raw: true,
            entryOnly: true,
            'banner': 'Banner'
        })
    ]
}
