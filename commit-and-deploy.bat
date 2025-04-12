@echo off
echo ===== 提交并部署 Tobenot-Story-Wiki =====

setlocal
set /p COMMIT_MSG=请输入提交信息: 

echo.
echo ===== 正在添加所有更改... =====
git add .

echo.
echo ===== 正在提交更改... =====
git commit -m "%COMMIT_MSG%"

echo.
echo ===== 正在推送到远程仓库... =====
git push

echo.
echo ===== 正在部署到 GitHub Pages... =====
npm run deploy

echo.
echo ===== 完成! =====
echo 您的更改已提交并部署到 GitHub Pages
echo 网站将在稍后可通过 https://tobenot.github.io/Tobenot-Story-Wiki/ 访问

pause
