function extension(marked, code) {
    let html = '<ul class="url-list">'
    let groups = code.split('\n\n')
    for (let group of groups) {
        let lines = group.split('\n')
        lines = lines.filter(line => line.length)
        let url = lines[1]
        html += `<div class="url-box">
        <a class="url-box-content" href="${url}">
            <div class="title">${lines[0]}</div>
            <div class="url">${url}</div>
        </a>
    </div>`
    }
    html += '</ul>'
    return html
}

export default extension
