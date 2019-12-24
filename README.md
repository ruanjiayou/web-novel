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

## error
- NotAllowedError 点击等事件里才能调用play()方法
- NotSupportError event.on() 里不能直接调用paly() 用定时器

## TODO: bug与优化
- ~~~cache~~~
- ~~~fullscreen (video player)~~~
- ads
- ~~~阻止非pwa模式~~~
- 启动界面的效果就是出不来
- 广告问题: 视频广告,图片广告; 跳转appStore, 网页iframe, 其他app.路由返回,倒计时,超时返回.
- ~~~隐藏referer~~~
- ~~~host设置功能~~~
- ~~~access-token过期bug~~~
- ~~~软件锁~~~ ErrorBoundary里怎么触发Observe?
- 这次代码写得比较烂
- ~~~可视化编辑后台~~~
- ~~~章节详情,ui:上一页,下一页~~~
- ~~~开发请求log ~~~
- ~~~未匹配路由没提示~~~
- 流程图,功能图
- ~~~mongo后端接口~~~
- 占位图
- ~~~没global-store没缓存的问题~~~
- ~~~loader得改改.~~~
- ~~~需考虑缓存(size,ttl不是很必要)~~~
- 加载前骨架?
- ~~~page的URL的params解析~~~
- ~~~navi写到context~~~
- ~~~开发面板: 可移动/显示调试的参数~~~
- ~~~歌单里删除歌曲~~~
- ~~~音乐播放器放到外层 top: -1000px,自己写控制按钮~~~
- 不使用橡皮筋效果,自己写(不然得有滚动的地方都加smooth类名~~ 反人类)better-scroll?
- iframe看小说
- 分组image字段
- picker和其他组件
- 本地记录
- Navi渐变
- 手势返回
- 前后端用同一组件库...
- 日志
- 多类型无限列表