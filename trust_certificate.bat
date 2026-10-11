@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo Installing PartX Local Code-Signing Certificate
echo ========================================================
echo.

certutil -addstore -user Root "PartX_Certificate.cer"
certutil -addstore -user TrustedPublisher "PartX_Certificate.cer"

echo.
echo Certificate installation completed!
echo You can now run "dist\win-unpacked\PartX File Splitter & Joiner.exe"
pause
