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
- 端口: 22, 80, 443, 5000 开放
- 测试用端口: 3000, 5000 开放（当彻底保证网站没有问题后可以关掉）

端口22：SSH远程登录服务器\
端口80：HTTP网络协议\
端口443：HTTPS网络协议（带加密，需要输入密码的网站推荐使用）

# 服务器登录
上面提到了最简单的密码账号登录方式，假设我们注册的用户名是`username` 密码是`password` 服务器IP`1.1.1.1`\
打开一个新的terminal
```bash 
ssh username@1.1.1.1
```
接下来系统会要求你输入密码。输入的时候terminal上是不会有显示的，所以直接输入然后按回车即可


# 下载代码
在terminal中输入
```bash 
git clone https://github.com/Thinktown-Education/allergy-lookup
```

下载完以后可以尝试输入
```bash 
ls
```
`ls` 这条命令可以让你看到当前目录的文件，不出意外你会看到allergy-lookup，也就是我们有源代码的目录。使用`cd`切换目录

```bash
cd allergy-lookup
```

# 环境配置

## 下载Docker和npm
可以在目录先运行一次`ls`, 感受一下当前目录都有那些内容。接下来我们先安装所有环境配置需要用到的工具。在terminal中运行下列命令：
```sh 
chmod +x install.sh
sudo ./install.sh
```

第一条命令用来更改`install.sh`这个脚本文件的权限，+x的意思就是添加execute（运行）的权限\
第二条命令则是以管理员权限`sudo`运行脚本文件。因为要安装工具，所以必须要管理员身份

运行脚本的时候中间会不间断的问一些 y/n 的问题，手动输入`y`并回车即可

## 更改配置
我们要把ip地址和数据库密码等各种信息存在根目录的.env文件内，然后但程序启动时会把.env里的参数传给每个容器
```sh
cp .env.example .env
ls -la
```
接下来你就能看到咱们项目根目录内多了一个.env的文件，把.env内的文件根据自己的需求进行更改

## 启动Docker环境
Docker是一个容器化工具。每一个容器相当于一个自己的隔离环境，可以不让程序之间的依赖产生冲突。老师已经提前把每个容器都配置好了，这里你只需要会运行即可。首先返回源目录，然后启动docker容器。
```sh
cd ..
sudo docker compose up --build -d
```
我们可以查看所有docker容器的状态, 应该看到每个容器都是`Up`的状态
```bash
sudo docker ps -a
```
如果不出意外我们可以看到三个容器，分别是frontend backend mysql。

## 数据库导入格式
数据库的默认登录用户名和密码是root和.env中你自己更改的`MYSQL_ROOT_PASSWORD`，这些在`docker-compose.yml`中定义好了。而我们下一步要做的就是把allergy数据库导入。在allergy-lookup根目录中运行以下两行命令
```bash
sudo docker exec -i mysql mysql -uroot -p<MYSQL_ROOT_PASSWORD> -e "CREATE DATABASE allergy"
sudo docker exec -i mysql mysql -uroot -p<MYSQL_ROOT_PASSWORD> allergy < mysql/allergy.sql
```

假如你的数据库密码是`123123`, 那么你就应该运行
```bash
sudo docker exec -i mysql mysql -uroot -p123123 -e "CREATE DATABASE allergy"
sudo docker exec -i mysql mysql -uroot -p123123 allergy < mysql/allergy.sql
```