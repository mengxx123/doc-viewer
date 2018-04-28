function extension(marked, code) {
    let downloadIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDAgNTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cgkuc3Qxe2ZpbGw6IzQyODVGNDt9Cjwvc3R5bGU+CjxyZWN0IHk9IjAiIGNsYXNzPSJzdDAiIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIi8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zOTUuOCwxODcuNWgtODMuM3YtMTI1aC0xMjV2MTI1aC04My4zTDI1MCwzMzMuM0wzOTUuOCwxODcuNXogTTEwNC4yLDM3NXY0MS43aDI5MS43VjM3NUgxMDQuMnoiLz4KPC9zdmc+Cg=='
    let lines = code.split('\n')
    lines = lines.filter(line => line.length)
    let url = lines[1]
    return `<div class="url-box">
    <a class="url-box-content" href="${url}">
        <img class="icon" src="${downloadIcon}">
        <div class="title">${lines[0]}</div>
        <div class="url">${url}</div>
    </a>
</div>`
}

export default extension
