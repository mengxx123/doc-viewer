<template>
    <my-page :title="title" :page="page">
        <div class="left-box">
            <div class="ui-article side-article markdown-body my-article" v-html="sideHtml"></div>
            <!--<ui-list>-->
                <!--<ui-list-item :title="item.title" v-for="item in items"-->
                              <!--@click="selectDoc(item)"-->
                              <!--:key="item.id">-->
                <!--</ui-list-item>-->
            <!--</ui-list>-->
        </div>
        <div id="article" class="right-box my-article">
            <ui-article class="article markdown-body" v-html="html" v-if="isMarkdown"></ui-article>
            <pre class="content" :style="contentStyle" v-if="!isMarkdown">{{ content }}</pre>
        </div>
        <div class="toc-box" v-html="toc"></div>
        <ui-drawer right :open="open" :docked="false" @close="toggleSetting()">
            <ui-appbar title="设置">
                <ui-icon-button icon="close" @click="toggleSetting" slot="left" />
            </ui-appbar>
            <div class="body">
                <ui-checkbox class="checkbox" v-model="isMarkdown" label="Markdown"/>
                <ui-text-field type="number" v-model.number="style.fontSize" label="字体大小" />
            </div>
        </ui-drawer>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import listTableExt from '../util/markdown-ext/listTable'
    import todoExt from '../util/markdown-ext/todo'
    import apiExt from '../util/markdown-ext/api'
    import linkExt from '../util/markdown-ext/link'
    import fileExt from '../util/markdown-ext/file'
    import directoryExt from '../util/markdown-ext/directory'
    import colorExt from '../util/markdown-ext/color'
    import tipExt from '../util/markdown-ext/tip'
    const marked = window.marked
    const Intent = window.Intent
    const yaml = require('js-yaml')

    const tocObj = {
        add: function(text, level) {
            var anchor = `#toc${level}${++this.index}`;
            this.toc.push({ anchor: anchor, level: level, text: text });
            return anchor;
        },
        // 使用堆栈的方式处理嵌套的ul,li，level即ul的嵌套层次，1是最外层
        // <ul>
        //   <li></li>
        //   <ul>
        //     <li></li>
        //   </ul>
        //   <li></li>
        // </ul>
        toHTML: function() {
            let levelStack = [];
            let result = '';
            const addStartUL = () => { result += '<ul>'; };
            const addEndUL = () => { result += '</ul>\n'; };
            const addLI = (anchor, text) => { result += '<li><a href="#'+anchor+'">'+text+'<a></li>\n'; };

            this.toc.forEach(function (item) {
                let levelIndex = levelStack.indexOf(item.level);
                // 没有找到相应level的ul标签，则将li放入新增的ul中
                if (levelIndex === -1) {
                    levelStack.unshift(item.level);
                    addStartUL();
                    addLI(item.anchor, item.text);
                } // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
                else if (levelIndex === 0) {
                    addLI(item.anchor, item.text);
                } // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
                else {
                    while (levelIndex--) {
                        levelStack.shift();
                        addEndUL();
                    }
                    addLI(item.anchor, item.text);
                }
            });
            // 如果栈中还有level，全部出栈打上闭合标签
            while(levelStack.length) {
                levelStack.shift();
                addEndUL();
            }
            // 清理先前数据供下次使用
            this.toc = [];
            this.index = 0;
            return result;
        },
        toc: [],
        index: 0
    };

    export default {
        data () {
            return {
                title: '文本阅读器',
                content: '',
                html: '',
                isMarkdown: false,
                open: false,
                items: [
                ],
                sideHtml: '',
                style: {
                    fontSize: 20
                },
                url: '',
                toc: '',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'settings',
                            click: this.toggleSetting,
                            title: '设置'
                        }
                    ]
                }
            }
        },
        computed: {
            contentStyle() {
                return {
                    'font-size': this.style.fontSize + 'px'
                }
            }
        },
        mounted() {
            this.init()
        },
        destroyed() {
            $('.my-article').of('click', 'a')
        },
        methods: {
            init() {
                // text parameter support
                let text = this.$route.query.text
                if (text) {
                    this.content = text
                }
                // url parameter support
                let url = this.$route.query.url
//                url = 'http://192.168.3.60:9999/wsdgy/api/README.md'
                if (url) {
                    this.loadTextFromUrl(url)
                }
                // 获取目录
                this.initIndex()
                // web intent support
                if (window.intent) {
                    this.content = window.intent.data
                }
//                $('#article').hide()
                let _this = this
                $('.my-article').on('click', 'a', function (e) {
                    e.preventDefault()
                    let link = this
                    let href = link.getAttribute('href')
                    function getOrigin(url) {
                        let arr = url.split(/[?#]/)
                        let ret = arr[0]
                        let index = ret.lastIndexOf('/')
                        return ret.substring(0, index)
                    }
                    let origin = getOrigin(_this.url)
                    if (href.includes(origin)) {
                        _this.loadTextFromUrl(href)
                    } else {
                        window.open(href)
                    }
                })

//                console.log(yaml.load('greeting: hello\nname: world'))
            },
            edit() {
                let intent = new Intent({
                    action: 'http://webintent.yunser.com/edit',
                    type: 'text/plain',
                    data: this.content
                })
                navigator.startActivity(intent, data => {
                    this.content = data
                    if (this.isMarkdown) {
// => <pre class="myClassName javascript">console.log("hello");</pre>
                        this.html = marked(this.content, {
                            renderer: renderer,
                            baseUrl: this.url
                        })
                    }
                }, data => {
                    console.log('失败')
                })
            },
            toggleSetting() {
                this.open = !this.open
            },
            loadTextFromUrl(url) {
                this.url = url
                url = url + '?time=' + new Date().getTime()
                this.$http.get(url).then(
                    response => {
                        let data = response.data
//                        if (/\.md$/.test(url)) {
                        if (true) {
                            this.isMarkdown = true
                            this.content = data

                            let renderer = new marked.Renderer()
                            let defaultCodeRender = renderer.code
                            renderer.code = (code, language) => {
                                switch (language) {
                                    case 'todo':
                                        return todoExt(marked, code)
                                    case 'table':
                                        return listTableExt(marked, code)
                                    case 'link':
                                        return linkExt(marked, code)
                                    case 'api':
                                        return apiExt(marked, code)
                                    case 'file':
                                        return fileExt(marked, code)
                                    case 'directory':
                                        return directoryExt(marked, code)
                                    case 'color':
                                        return colorExt(marked, code)
                                    case 'tip':
                                    case 'warning':
                                    case 'danger':
                                        return tipExt(marked, code, language)
                                    default:
                                        let code2 = hljs.highlightAuto(code).value
                                        return `<pre>
    <code class="lang-${language}">${code2}</code>
</pre>`
                                }
                            }
                            let _this = this
//                            renderer.image = function(href, title, text) {
//                                href = _this.data.baseUrl + href
//                                var out = '<img src="' + href + '" alt="' + text + '"';
//                                if (title) {
//                                    out += ' title="' + title + '"';
//                                }
//                                out += this.options.xhtml ? '/>' : '>';
//                                return out;
//                            };
                            renderer.heading = function(text, level, raw) {
                                var anchor = tocObj.add(text, level);
                                return `<a id=${anchor} class="anchor-fix"></a><h${level}>${text}</h${level}>\n`
                            }
// => <pre class="myClassName javascript">console.log("hello");</pre>
                            let baseUrl = ''
                            function getBaseUrl(url) {
                                let arr = url.split(/[?#]/)
                                let ret = arr[0]
                                let index = ret.lastIndexOf('/')
                                return ret.substring(0, index)
                            }
                            this.html = marked(data, {
                                gfm: true,
                                renderer: renderer,
//                                highlight: code => {
//                                    console.log('高了', code)
//                                    return hljs.highlightAuto(code).value
//                                },
                                baseUrl: this.url
                            })

                            document.getElementById('article').scrollTop = 0
                            this.toc = tocObj.toHTML()
                        } else {
                            this.content = data
                        }
                    },
                    response => {
                        console.log(response)
                    })
            },
            initIndex() {
                let url = 'http://192.168.3.60:9999/wsdgy/docs/requirement.json' + '?time=' + new Date().getTime()
                this.$http.get(url).then(
                    response => {
                        let data = response.data
                        this.data = data
                        this.title = data.info.title
                        document.title = data.info.title

                        this.items = data.items
//                        this.loadTextFromUrl(this.data.baseUrl + this.items[0].url)
                        this.loadTextFromUrl(this.data.homeUrl)
                        this.loadSideBar()
                    },
                    response => {
                        console.log(response)
                    })
            },
            loadSideBar() {
                // TODO
                let url = this.data.tocUrl + '?time=' + new Date().getTime()
                this.$http.get(url).then(
                    response => {
                        let data = response.data
                        console.log('策略')
                        this.sideHtml = marked(data, {
                            baseUrl: this.url
                        })
//                        this.data = data
//                        this.title = data.info.title
//                        document.title = data.info.title
//                        this.loadTextFromUrl(this.data.baseUrl + this.items[0].url)
//                        this.loadSideBar()
//                        this.items = data.items
                    },
                    response => {
                        console.log(response)
                    })
            },
            selectDoc(item) {
                this.loadTextFromUrl(this.data.baseUrl + item.url)
            }
        }
    }
</script>

<style scoped>
.ui-file-button{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
    margin-bottom: 16px;
}
.content {
    font-size: 16px;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;
}
.body {
    padding: 16px;
}
.file-btn {
    margin-top: 16px;
}
.article {
    margin: 0 auto;
    max-width: 800px;
}
</style>
