@echo off
set ANDROID_HOME=C:\Users\Admin\AppData\Local\Android\Sdk
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%
npx expo start --android --clear
