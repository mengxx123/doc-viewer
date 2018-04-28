function removeFirstLine(text) {
    let arr = text.split('\n')
    arr.splice(0, 2)
    return arr.join('\n')
}

function extension(marked, code) {
    let lines = code.split('\n')
    lines = lines.filter(line => line.length)
    let html = '<div class="md-api">'
    // html += lines[0]

    // parse first line (method and url)
    let arr = lines[0].split(/\s+/)
    let method = arr[0]
    let url = arr[1]
    html += `<div class="head"><span class="method">${method}</span> <span class="url">${url}</span></div>`

    // parse parameter
    let paramText
    if (code.includes('<<<')) {
        paramText = code.split('<<<')[0]
    } else {
        paramText = code
    }
    // paramText.replace(/^[^\n]+/, '')
    let paramArr = paramText.split('\n')
    // remove first line and empty line
    paramArr.shift()
    paramArr = paramArr.filter(line => line.length)
    if (paramArr.length) {
        html += '<table>'
        html += `<tr>
    <th>参数</th>
    <td>类型</td>
    <td>必须</td>
    <td>默认值</td>
    <td>描述</td>
</tr>`
        for (let line of paramArr) {
        // *sort : int = 2121 # 排序
            let match = line.match(/(\*?)([\S]+)\s+(:\s+(\S+))?/)
            let name = match[2]
            let type = 'string'
            if (line.includes(':')) {
                type = line.match(/:\s+(\S+)/)[1]
            }
            let defaultValue = ''
            if (line.includes('=')) {
                defaultValue = line.match(/=\s+(\S+)/)[1]
            }
            let comment = ''
            if (line.includes('#')) {
                comment = line.match(/#\s+([\w\W]+)/)[1]
            }

            html += `<tr>
    <td>${name}</td>
    <td>${type}</td>
    <td>${match[1] ? '是' : '否'}</td>
    <td>${defaultValue}</td>
    <td>${comment}</td>
</tr>`
        }
        html += '</table>'
    }

    // parse response
    let responses = code.split('<<<')
    responses.shift()
    for (let response of responses) {
        let json = removeFirstLine(response)
        html += `<pre><code>${json}</code></pre>`
    }

    html += '</div>'
    // let html = marked(code)
    return html
}

export default extension
