function hyphenToUpperCase(name) {
    if (!name) {
        return name;
    }
    return name.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

function arrayToObject(arr) {
    if (!arr) {
        return;
    }
    return arr.reduce((result, currentItem) => {
        const key = Object.keys(currentItem)[0];
        result[hyphenToUpperCase(key)] = currentItem[key];
        return result;
    }, {});
}

module.exports = {
    arrayToObject,
};
