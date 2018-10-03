!macro customInstall
    DetailPrint "Register togetherstalk URI Handler"
    DeleteRegKey HKCR "togetherstalk"
    WriteRegStr HKCR "togetherstalk" "" "URL:togetherstalk"
    WriteRegStr HKCR "togetherstalk" "URL Protocol" ""
    WriteRegStr HKCR "togetherstalk\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    WriteRegStr HKCR "togetherstalk\shell" "" ""
    WriteRegStr HKCR "togetherstalk\shell\Open" "" ""
    WriteRegStr HKCR "togetherstalk\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend