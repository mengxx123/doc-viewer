var parser = require('./md-list-tree-parser')

function tree2Html(treeObj) {
    let html = '<ul class="todo-list">'
    for (let node of treeObj) {
        html += `<li class="${node.style === '*' ? '' : 'finish'}">${node.text}`
        if (node.children) {
            html += tree2Html(node.children)
        }
        html += '</li>'
    }
    html += '</ul>'
    return html
}

function extension(marked, code) {
    let tree = parser(code)
    let html = tree2Html(tree)
    // return `<div class="todo-box">${marked(code)}</div>`
    return html
}

export default extension
