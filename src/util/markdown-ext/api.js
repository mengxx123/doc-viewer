function listTable(marked, code) {
    let lines = code.split('\n')
    lines = lines.filter(line => line.length)
    let html = '<div class="md-api">'
    // html += lines[0]

    let arr = lines[0].split(/\s+/)
    let method = arr[0]
    let url = arr[1]
    html += method + url

    for (let line of lines) {
    }

    html += '</div>'
    // let html = marked(code)
    return html
}

export default listTable
