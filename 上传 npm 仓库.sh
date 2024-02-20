# [必须] 官方镜像
npm config set registry https://registry.npmjs.org 

# 代理
npm config set proxy http://localhost:7890


# 登录 npm user 
npm login --auth-type=legacy 

# 上传
npm publish

# 撤销上传
# npm unpublish --force

# 【上传完成后】

##  配置完之后可以切回淘宝源
npm config set registry=http://registry.npm.taobao.org/    