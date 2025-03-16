function removeStringVazia(data) {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
    );
}

module.exports = {
    removeStringVazia,
}