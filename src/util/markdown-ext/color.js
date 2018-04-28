function extension(marked, code) {
    let html = ''
    let lines = code.split('\n')
    lines = lines.filter(line => line.length)
    html += '<ul class="color-list">'
    for (let line of lines) {
        let color
        let description = ''
        if (line.includes(':')) {
            color = line.split(':')[0]
            description = line.split(':')[1]
        } else {
            color = line
        }
        html += `
        <li class="item">
            <div class="color" style="background-color: ${color}"></div>
            <div class="code">${color}</div>
            <div class="description">${description}</div>
        </li>`
    }
    html += '</ul>'
    return html
}

export default extension
