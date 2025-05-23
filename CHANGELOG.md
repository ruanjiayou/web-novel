# 开发进度

继承自web-password的进度

## master 2019-09-30

- 书架页面与mock

- 书籍详情
- hideMenu
- mock自动加载
- pages路由自动匹配
- 更新antd-mobile版本
- 菜单config添加path字段
- mock单独放
- baseURL优化
- BaseLoader defaultValue问题
- BaseLoader 排序问题

## master 2019-10-02 03:52

- 目录页/正文 序号/进度ref
- Loader和Model都首字母大写
- component和business里都加View后缀
- pages里都加Page后缀
- services里按文件分
- data-loader改为loader
- 路由上下文改名为useRouterContext
- models里都采用APPModel方式命名
- utils/time number
- VisuaBoxView/SwitchView/AutoCenterView
- mock-server添加控制配置
- isDebug和console配置

## master 2019-10-3 03:01:08

- web-api-admin三端,public-user-admin三角色
- 真实接口联调
- state传值
- globalStore context
- delete app.js
- 嵌套的分类model
- 优化route和page映射
- 绝定尽量不用分号

## master 2019-10-4 02:07:12 该先后端的了

- 采集

## master 2019-10-10 01:09:02

- 下一页
- cache功能
- 修改约定字段
- 浏览器检测.pc中显示mobile
- DataLoader 参数改为 {query,params,data}
- tree类型model定义

## master 2019-10-20 13:29:03

- shttp和global-state循环引用bug
- router添加params获取url的params

## master 2019-10-21 02:00:05

- Navi写为context(hideMenu默认true)
- todo添加和列表(暂无修改和删除)

## master 2019-11-12 07:04:21

- 优化context
- 添加音乐播放页面
- 橡皮筋效果与阻止x
-

## master 2019年11月13日04:27:52

- 播放器放最外面 路由变化也不影响播放
- debug面板与拖拽

## master

- Dragger
- 自动播放问题
- items loader 添加自定义方法

## master 2019-12-13 21:48:07

- 开始初始化加载线路或广告
- context的隐藏(音乐播放的有问题)
- item都放到resource中
- BaseLoader添加自定义方法
- 图片页面
- 浏览器speaker(失败)
-

## master 2019-12-24 23:02:09

- 非强制登录
- 自定义Empty
- 全局audio播放bug
- filter分组自动显示列表(TODO:改为resource列表)
- 登录页面可控制是否显示返回Navi

## 2019-12-27 02:00:30

-router和store的context必须用useProvider不然报错...

- 修改components和contexts.统一导出
- userarea
- line empty bug
- 个人中心bug

## 2019-12-28 02:04:48

- boot接口返回lines/tabs/channels以及可能有的user
- music上下文显示逻辑
- emptyView的bug
- loader的isLoading bug

## 2019-12-28 18:38:10

- ResourceItem自适应Item类型
- fixbug: loadMore page++bug; 首页tab路由bug;

## 2019-12-29 22:45:19

- fixbug: 重复渲染调用loader请求
- fixbug: request错误显示不正常bug

- group_id => id
- ArticlePage
- fullscreen fail
- lighthigh fail

## 2020-01-08 00:24:18

- 打包优化 2.9M => 1.1M

## 2020-06-28 00：59

- 多层layer
- router <=> view vm实现
- view和loader结合

## 2020-07-22

- book history record
-

## 2020-08-08

- useAudio
-

## 2020-12-06

- 转场动画

## 2020-12-07

- 游客观看
- /root/ 没匹配到直接跳到home

## 2021-02-01

- change root path to novel

## 2021-03-29

- 最近播放功能
- pinch

## 2021-07-20 00:20

- 音乐播放历史
- 音乐多素材支持(audio/irics/mv)
- random模块

## 2021-7-25 01:56:30

- PC使用iframe套一层再显示
- 直接进入视频播放页(原先是视频详情->视频播放)
- 点击跳转进度

## 2021-7-25 23:25:54

- 修改history返回的bug

## 2021-7-26 22:46:39

- 登录提示
- 首页字数格式化
- resource模型修改

## 2021-7-28 14:04:22

- 图片资源不存在返回404而不是首页html
- 播放waiting效果遮挡修改
- loader 超时错误点击刷新?

## 2021-7-30 18:36:31

- 音乐item优化
- 音乐播放器优化

## 2021-12-6 01:44:02

- 播放器优化
  - 返回按钮: 全屏不显示,其他时候都要显示
  - title
  - 音量控制显示
  - 进度相关调整

## 2022-3-1 15:43:53

- mp4音量控制bug修改
- 播放结束状态
- 进度拖动
- 播放界面layer优化
-

## 2022-3-17 01:20:02

- 背景图片
- 播放控制层延时/播放结束修复

## 2024-10-20 16:45:00
- 更换手势库
- 网页快进和倍速

## 2025-01-01 01:21:00
- tab组件移动效果
- video懒加载