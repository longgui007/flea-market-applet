# 项目名称：跳蚤市场小程序

## 1. 项目部署

### 1.1 在开发者工具中新建项目

打开微信开发者工具，添加小程序项目，使用自己的APP ID，勾选云开发服务，新建项目。

### 1.2 下载代码

进入到项目目录中删除所有文件，使用如下命令将代码下载到本地：

```bash
git clone https://github.com/longgui007/flea-market-applet.git
```
### 1.3 初始化云环境并修改参数

点击开发者工具的云开发，启用云服务。新建自己的云环境，复制云环境ID，**然后把`app.js`和所有`cloudfunctions`文件夹**下所有云函数的`index.js`中的：

```javascript
cloud.init({
  env: "xxxx" // 替换自己的云环境ID
})
```

的`env`的值替换成自己的云环境ID。**此处很容易漏掉`app.js`中的云环境ID配置！**

右击`cloudfunctions`，选择当前云环境。

分别右击`category, commodity, commodity_question, commodity_answer, swiper, transaction, university, user`云函数，选择在终端打开，输入如下命令安装依赖：

```bash
npm install --save tcb-router
```

### 1.4 云数据库初始化

打开 云开发->数据库->集合名称 建立8张数据表：`category, commodity, commodity_question, commodity_answer, swiper, transaction, university, user`

导入`resources`文件夹下相应`json`文件到指定数据库。

### 1.5 上传云存储

在 云开发控制台->存储 中新建`bg-image`文件夹，将`resources`文件夹下的图片上传至云存储中。

复制`index-bg.jpg`的下载地址，替换下面文件的`url`中的值

路径：`miniprogram/pages/index/index.wxss`

```CSS
page{
  background-image: url(xxxx);
}

```

复制`wave.gif`的下载地址，替换下面文件第二个`image src`的值

路径：`miniprogram/pages/home/home.wxml`

```html
<view class="UCenter-bg">
    <image src="xxxx" class="gif-wave"></image>
</view>
```

复制`home-bg.jpg`的下载地址，替换下面文件的`url`中的值

路径：`miniprogram/pages/home/home.wxss`

```javascript
.UCenter-bg {
  background-image: url(xxxx);
  background-size: cover;
............
}
```

### 1.6 部署云函数

在`cloudfunctions`下右击每个云函数，点击 上传并部署：云端安装依赖。

### 1.7 运行项目

点击编译，运行项目。

