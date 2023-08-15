网站发布\
老师：刘心语 Max\
学生：方旭浩\
用时：1小时

# 服务器租借
可以搜索网上的各种cloud hosting，vps服务。国内比较便宜的有腾讯云，国外花样就比较多了。本节课我们用微软云Azure进行演示。\
首先是对机器配置进行选择，由于网站需要用到docker和mysql这种比较吃配置的服务，所以建议至少单核cpu + 4G内存。

硬件配置
- 服务器地理位置: US
- CPU: 1
- Memory/RAM: 4G
- 操作系统: Ubuntu 22.04 LTS

登录方式：
- 账号密码：推荐新手
- public key：专业度略高，感兴趣的话可以自学什么是public key和private key。Mac生成key的方式非常简单

网络安全配置：
- 端口: 22, 80, 443 开放
- 测试用端口: 3000, 5000 开放（当彻底保证网站没有问题后可以关掉）

端口22：SSH远程登录服务器\
端口80：HTTP网络协议\
端口443：HTTPS网络协议（带加密，需要输入密码的网站推荐使用）

# 服务器登录
上面提到了最简单的密码账号登录方式，假设我们注册的用户名是`username` 密码是`password` 服务器IP`1.1.1.1`\
打开一个新的terminal
```sh 
ssh username@1.1.1.1
```
接下来系统会要求你输入密码。输入的时候terminal上是不会有显示的，所以直接输入然后按回车即可


# 下载代码
在terminal中输入
```sh 
git clone https://github.com/Thinktown-Education/allergy-lookup
```

下载完以后可以尝试输入
```sh 
ls
```
`ls` 这条命令可以让你看到当前目录的文件，不出意外你会看到allergy-lookup，也就是我们有源代码的目录。使用`cd`切换目录

```sh 
cd allergy-lookup
```

# 环境配置
可以在目录先运行一次`ls`, 感受一下当前目录都有那些内容。接下来我们先安装所有环境配置需要用到的工具。在terminal中运行下列命令：
```sh 
chmod +x install.sh
./install.sh
```