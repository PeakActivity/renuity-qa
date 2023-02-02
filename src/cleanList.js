const cleanList = (items) => items
    .filter(i => i)
    .map(i => i.replace(`’`,`'`))
    .map(i => i.replace(`...`, ``))
    .map(i => i.replace(`…`, ``))
    .map(i => i.replace(/[\u200B-\u200D\uFEFF]/g, ''))
    .map(i => i.trim())
    .sort()

module.exports = cleanList;
