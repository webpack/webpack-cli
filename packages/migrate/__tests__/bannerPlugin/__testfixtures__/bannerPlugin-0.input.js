module.exports = {
    plugins: [
        new webpack.BannerPlugin('Banner', { raw: true, entryOnly: true })
    ]
}
