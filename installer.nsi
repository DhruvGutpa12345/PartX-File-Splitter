; PartX Modern NSIS Installer Script
!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "PartX File Splitter & Joiner"
OutFile "dist\PartX-Setup-Signed-1.1.0.exe"
InstallDir "$LOCALAPPDATA\Programs\PartX"
RequestExecutionLevel user
SetCompressor /SOLID lzma
CRCCheck off


; Interface Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "build\icon.ico"
!define MUI_UNICON "build\icon.ico"


; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\PartX.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch PartX"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "dist\win-unpacked\*.*"

  ; Create Shortcuts
  CreateDirectory "$SMPROGRAMS\PartX"
  CreateShortcut "$SMPROGRAMS\PartX\PartX.lnk" "$INSTDIR\PartX.exe"
  CreateShortcut "$DESKTOP\PartX.lnk" "$INSTDIR\PartX.exe"

  ; Write Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  CreateShortcut "$SMPROGRAMS\PartX\Uninstall PartX.lnk" "$INSTDIR\Uninstall.exe"

  ; Registry Keys for Windows Add/Remove Programs
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "DisplayName" "PartX File Splitter & Joiner"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "DisplayIcon" '"$INSTDIR\PartX.exe"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "DisplayVersion" "1.1.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX" "Publisher" "Dhruv Gupta"
SectionEnd


Section "Uninstall"
  RMDir /r "$INSTDIR"
  RMDir /r "$SMPROGRAMS\PartX"
  Delete "$DESKTOP\PartX File Splitter.lnk"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PartX"
SectionEnd
