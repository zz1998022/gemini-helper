# Gemini接口

## 介绍

使用了Google官方的Gemini Sdk，基本上文档上有的功能都能实现，目前实现了普通聊天和流式聊天

使用`typescript` + `express` + `nodemon`,调试时使用`tsx`,比ts-node更好用的ts运行时

项目基于标准的MVC架构进行封装

## 使用方法

使用前先添加env文件，分别为`.env.dev`和`.env.prod`,dev为开发环境所使用，prod为生产环境所使用

参数如下

```shell
# 启动端口
PORT=3000

# Gemini API Key（必填）
GEMINI_API_KEY=你的Gemini key

# 是否使用代理 （可选）
USE_PROXY=true

# 全局代理地址 （可选）
PROXY_URL=http://127.0.0.1:7897

# 数据库地址（写法参照prisma文档）
DATABASE_URL=你的数据库地址

# prisma映射地址（生成prisma映射文件地址）
PRISMA_OUTPUT=../src/generated/prisma
```