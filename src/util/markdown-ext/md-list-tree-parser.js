function parse2Json(pathOrContent) {
    return doParse(pathOrContent)
}

function doParse(mdTree) {
    let jsonTree = []
    let lines = mdTree.split('\n')
    lines = lines.filter(line => line.length)
    // let regex = /^(\s*)-\s\[(.*)\]\s*(\((.*)\))?/
    let regex = /^(\s*)([\*\-])\s+([\w\W]+)/
    lines.forEach(function(line, i) {
        let matchs = line.match(regex)
        if (matchs) {
            let level = matchs[1].length / 4
            let text = matchs[3]
            let node = {
                text: text,
                style: matchs[2]
            }
            let match = text.match(/\[([\w\W])+\]\(([\w\W]+)\)/)
            if (match) {
                node.text = match[1]
                node.url = match[3]
            }
            if (level === 0) {
                jsonTree.push(node)
            } else {
                let p = getParentNode(level, jsonTree)
                p.children.push(node)
            }
        } else {
            console.log('不匹配')
        }
    })
    return jsonTree
}

function getParentNode(level, jsonTree) {
    let i = 0
    let node = jsonTree[jsonTree.length - 1]
    while (i < level - 1) {
        let children = node.children
        node = children[children.length - 1]
        i++
    }
    if (!node.children) {
        node.children = []
    }
    return node
}

module.exports = parse2Json
