# PWA-novel

2019-9-28 00:26:09 clone自password

- 修改push.sh pass为novel
- 原来的author没改...
- manifest pass改为novel
- 修改config.js配置菜单 app的model改默认菜单
- npm i && npm start

- git clone
- cd pwa
- npm i
- npm start

## warning

- keyboardjs rebound 是 react-use 需要的.
- WorkboxWebpackPlugin将sw-template.js编译为sw-build.js(sw-manager.js里注册service-worker,选择sw-build而不是默认生成的service-worker.js,build的js不能覆盖...)

## error

- NotAllowedError 点击等事件里才能调用play()方法
- NotSupportError event.on() 里不能直接调用paly() 用定时器

## TODO: bug与优化

- ~~cache~~
- ~~fullscreen (video player)~~
- ads
- ~~阻止非pwa模式~~
- 启动界面的效果就是出不来
- 广告问题: 视频广告,图片广告; 跳转appStore, 网页iframe, 其他app.路由返回,倒计时,超时返回.
- ~~隐藏referer~~
- ~~host设置功能~~
- ~~access-token过期bug~~
- ~~软件锁~~ ErrorBoundary里怎么触发Observe?
- 这次代码写得比较烂
- ~~可视化编辑后台~~
- ~~章节详情,ui:上一页,下一页~~
- ~~开发请求log ~~
- ~~未匹配路由没提示~~
- 流程图,功能图
- ~~mongo后端接口~~
- 占位图
- ~~没global-store没缓存的问题~~
- ~~loader得改改.~~
- ~~需考虑缓存(size,ttl不是很必要)~~
- 加载前骨架?
- ~~page的URL的params解析~~
- ~~navi写到context~~
- ~~开发面板: 可移动/显示调试的参数~~
- ~~歌单里删除歌曲~~
- ~~音乐播放器放到外层 top: -1000px,自己写控制按钮~~
- ~~不使用橡皮筋效果,自己写(不然得有滚动的地方都加smooth类名~~ 反人类)better-scroll?~~
- ~~iframe看小说~~
- 分组image字段
- ~~picker和其他组件~~
- ~~本地记录~~
- ~~Navi渐变~~
- ~~手势返回~~
- 前后端用同一组件库...
- 日志
- ~~多类型无限列表~~
- ~~打包优化大小~~
- ~~ImageItem交互优化~~
- ~~Home的tab路由变化~~
- ~~group单页根据name查询~~
- ~~统一用resource的model~~
- ~~onQueryChange 要放顶层? group fetch后调用一次?~~
- ~~重复render的bug group里就带数据? 先做resource的后台~~
- 音乐播放器优化
- ~~小窗播放m3u8~~
- TODO优化
- .env不起作用
- ~~后台用上react-ueditor~~
- ~~MySQL旧数据还原~~
- ~~react-use解决重复render问题?~~
- 排行榜组件与数据
- ~~持续更新小说~~
- ~~loader的逻辑优化~~
- ~~音乐的优化~~
- ~~filter收起~~
- ~~loader数据的保持~~
- ~~多层覆盖~~
- ~~启动用化~~
- ~~都放到root目录~~
- ~~image-line优化~~
- ~~group页参数处理~~
- ~~响应用户onpopstate事件 与 动画~~
- ~~存储前缀~~
- ~~history-record 书架~~
- ~~无限列表 下拉刷新/上拉加载~~
- ~~播放器事件~~
- ~~滑动删除~~
- ~~收藏与名单~~
- ~~收藏细化~~
- ~~goBack回到home而不是历史~~
- ~~iOS原生的前进后退手势会造成动画重复~~
- ~~搜索页面~~
- ~~起点型条件收缩~~
- ~~再次尝试手势返回~~
- ~~请求全屏~~
- ~~拖动快进~~
- ~~下一集~~
- ~~back()的bug,会到空白页~~
- ~~view变化时,底部tab选中有问题~~
- ~~记录视频进度(多p)~~
- Music修改(播放时显示在tab上面,item优化:同个type多种显示方式)
- ~~播放资源出错处理~~
- ~~频道图片字段~~
- ~~播放列表大于1才显示~~
- ~~标签显示的文章位置~~
- ~~播放器手势失败~~
- ~~组件~~
- ~~random列表文字自适应bug~~
- ~~safari 无法触发 seeked事件~~
- ~~图片懒加载~~
- ~~iphone安装底部有空隙~~ body的height为100%pwa底部有缝隙,为100vh网页底部没有sticky
- ~~播放器全屏有滚动条~~
- ~~自动播放~~必须muted...
- ~~点击标签跳转~~
- ~~进度条拖动滑块~~
- ~~初始化时的播放按钮~~
- ~~转场动画的逻辑bug~~
- 屏幕尺寸适配
- ~~收藏接口多查询资源详情~~
- hls子文件ts路径重写(/开头换掉)
- pinch 多图与双击(缩放后可以平移，否则平移就是切图？)
- ~~反馈功能~~
- ~~下拉刷新~~
- ~~pixiv不显示问题~~
- ~~收藏页面重复请求bug~~
- ~~同一个资源类型的不同展示分为不同的组件,通过 display 来分发,不然写法太乱了~~
- ~~转场动画的逻辑bug(必定重现:进入视频,replaceView,手势退出)~~
- ~~Safari网页和webview里高度不一致的问题~~
- ~~搜索结果分类，改用search接口而不是resource-list~~
- ~~react-player播放hls失败的问题~~
- ~~tabs列表设置初始化不自动请求，手动控制~~
- ~~网页快进，倍速~~