const cleanList = (items) => items
    .map(i => i?.trim())
    .filter(i => i)
    .map(i => i.replace(`’`,`'`))
    .map(i => i.replace(`...`, ``))
    .map(i => i.replace(`…`, ``))
    .sort()

module.exports = cleanList;
