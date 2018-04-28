function extension(marked, code, type) {
    return `<div class="custom-block ${type}">
    ${code}
</div>`
}

export default extension
