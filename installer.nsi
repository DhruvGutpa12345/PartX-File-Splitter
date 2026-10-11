; PartX Modern NSIS Installer Script
!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "PartX File Splitter & Joiner"
OutFile "dist\PartX-Setup-Signed-1.0.0.exe"
InstallDir "$LOCALAPPDATA\Programs\PartX"
RequestExecutionLevel user
SetCompressor /SOLID lzma
CRCCheck off


; Interface Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "C:\Users\dg321\AppData\Local\electron-builder\cache\nsis\nsis-3.0.4.1\Contrib\Graphics\Icons\modern-install-blue.ico"
!define MUI_UNICON "C:\Users\dg321\AppData\Local\electron-builder\cache\nsis\nsis-3.0.4.1\Contrib\Graphics\Icons\modern-uninstall-blue.ico"


; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\PartX File Splitter & Joiner.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch PartX File Splitter & Joiner"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\win-unpacked\*.*"

  ; Create Shortcuts
  CreateDirectory "$SMPROGRAMS\PartX"
  CreateShortcut "$SMPROGRAMS\PartX\PartX File Splitter.lnk" "$INSTDIR\PartX File Splitter & Joiner.exe"
  CreateShortcut "$DESKTOP\PartX File Splitter.lnk" "$INSTDIR\PartX File Splitter & Joiner.exe"

  ; Write Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateShortcut "$SMPROGRAMS\PartX\Uninstall PartX.lnk" "$INSTDIR\Uninstall.exe"

  ; Registry Keys for Windows Add/Remove Programs
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "DisplayName" "PartX File Splitter & Joiner"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "DisplayIcon" '"$INSTDIR\PartX File Splitter & Joiner.exe"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "DisplayVersion" "1.0.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "Publisher" "PartX Community"
SectionEnd

Section "Uninstall"
  RMDir /r "$INSTDIR"
  RMDir /r "$SMPROGRAMS\PartX"
  Delete "$DESKTOP\PartX File Splitter.lnk"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX"
SectionEnd
