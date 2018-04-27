function listTable(marked, code) {
    return `<div class="todo-box">${marked(code)}</div>`
}

export default listTable
