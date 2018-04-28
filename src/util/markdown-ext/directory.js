var parser = require('./md-list-tree-parser')
var treeify = require('treeify')

function treeObj2Obj(treeObj) {
    let obj = {}
    for (let node of treeObj) {
        if (node.children) {
            obj[node.text] = treeObj2Obj(node.children)
        } else {
            obj[node.text] = {}
        }
    }
    return obj
}

function extension(marked, code) {
    var json = parser(code)
    json = treeObj2Obj(json)
    let text = treeify.asTree(json, true)
    return `<pre class="ext-directory">${text}</pre>`
}

export default extension
