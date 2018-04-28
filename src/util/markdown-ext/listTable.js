function extension(marked, code) {
    let table = ''
    let trs = ''
    let groups = code.split(/\n{2,}/)
    for (let group of groups) {
        let tr = ''
        let lines = group.split('\n')
        lines = lines.filter(line => line.length)
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i]

            let match = line.match(/\s*([*#]+)(\d?)\s+([\w\W]+?)$/)
            if (match) {
                let level = match[1].length
                let levelStr = level === 1 ? '' : ` colspan="${level}"`
                let rowspan = match[2] ? ` rowspan="${match[2]}"` : ''
                let type = match[1].includes('#') ? 'th' : 'td'
                tr += `<${type}${levelStr}${rowspan}>${marked(match[3])}</${type}>`
            }
        }
        trs += `<tr>${tr}</tr>`
    }
    table = `<table>${trs}</table>`
    return table
}

export default extension
