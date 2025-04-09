# Start of Selection
$ErrorActionPreference = "Stop"

npm run build

cd dist

git init
git add -A
git commit -m "部署"  # 修改提交信息为中文

git push -f git@github.com:tobenot/Tobenot-Story-Wiki.git master:gh-pages

cd ..

Write-Host "部署完成！" 
# End of Selection