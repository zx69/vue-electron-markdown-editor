# vue-electron-makrdown-editor

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Notice
1.  选型时一开始考虑使用github上热门的vue&electron模板`SimulatedGREG/electron-vue`, 但试用后发现这个模板已经几年没有更新, 不仅没有使用vue-cli3, 其默认集成的electron还是2.x.x版(当前electron最新版为9.x.x).考虑到electron每个大版本区别较大, 为避免出现配置落后的情况,所以改用`vue-cli`+`Vue CLI Plugin Electron Builder`自行搭建.

2.  Electron + webpack的大坑: 使用webpack打包后, 主进程各个文件将被打包到bundle, 在渲染进程中使用remote.require获取不到主进程main.js, 将出现各种奇怪的错误. 各种electron教程中的通信方法因此实现. 查了半天资料,最后改用ipcMain和ipcRenderer来实现主进程和渲染进程的通信.
  
3.  项目打包和修改重构时, 命令行会出现报错如下:
```
INFO  Launching Electron...
Failed to fetch extension, trying 4 more times
Failed to fetch extension, trying 3 more times
Failed to fetch extension, trying 2 more times
...
```
经查这个时因为众所周知的原因, 大陆网络访问补了`google`系的网站. 而打包用的`electron-devtools-installer`插件工作方式, 是检测是否存在这个扩展，如果没有就开始从google网站下载, 所以导致一直连接失败.虽然等等倒数5个数后会放弃安装,当每次修改后都要等几十秒重构, 这个是不可接受的. 后来看到一个解决方法:
```
Electron构建的应用会在 C:\Users\{username}\AppData\Roaming{appName}\extensions 目录下存放扩展文件,里面会有一个IDMap.json文件，如果没有请新建. IDMap.json里面存放了key 为 扩展ID，value 为扩展名称的对象
如：{"nhdogjmejiglipccpnnnanhbledajbpd":"Vue.js devtools"}. 之后还会有一个以extensionID命名的文件夹,里面是安装好的扩展文件. 这个插件可以通过chrome扩展商店下载的. 如果找不到相应的扩展文件 可以网上搜索相应的扩展ID 再通过 http://yurl.sinaapp.com/crx.php 下载扩展包, 之后安装在chrome中后找到扩展包实际存放位置,
复制已经解压好的扩展文件, 直接复制到我们自己的项目缓存扩展文件的文件夹extensions下（上文有提到）.之后重启应用就可以了.
```
自己试了几次, 使用这种方法还是没办法安装devtools插件,但至少不会再有上面的等等时间.
