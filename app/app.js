
const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const platform = require('os').platform();
const appMenu = require('./menu');
const path =require('path');
const ipcMain = electron.ipcMain;
const version = '2017071001';
const AutoLaunch = require('auto-launch');

/* 운영체제 시작시 실행*/
let appPath = process.platform === 'darwin' ? (app.getPath('exe').split('.app/Content')[0] + '.app') : app.getPath('exe');
const appLauncher = new AutoLaunch({
  name: app.getName(),
  path: appPath,
  isHiddenOnLaunch: false
});
appLauncher.enable();
/*운영체제 시작시 실행 끝*/

// install, uninstall event 잡기
const handleStartupEvent = function() {
    if (process.platform !== 'win32') {
        return false;
    }

    const squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
        case '--squirrel-uninstall':
        case '--squirrel-obsolete':
            app.quit();
            return true;
    }
    return false;
};

if (handleStartupEvent()) {
    return;
}
// install event, uninstall event

let willQuitApp = false;
let window;


/* single instance 유지를 위한 코드 */
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (window) {
        if (window.isMinimized())
        {
          window.restore();
        }
        if(!window.isVisible()){
          window.show();
        }

        window.focus();
      }
});

if (shouldQuit) {
  app.quit()
}



app.on('ready', () => {
  if (platform == 'darwin') {
    window = new electron.BrowserWindow({width : 1024,minWidth:330, height :720,minHeight: 450, show: false, icon: __dirname + '/images/Icon.ico', webPreferences :{ defaultFontSize : 14}});
  }
  else if (platform == 'win32') {
    window = new electron.BrowserWindow({width : 1024,minWidth:330, height :720,minHeight: 450, show: false, icon: __dirname + '/images/Icon.ico', webPreferences :{ defaultFontSize : 13}});
  }

  window.once('ready-to-show', function(){
    window.show();
  });

  window.on('blur', function(){

  });
  window.on('focus', function(){

  });
  Menu.setApplicationMenu(appMenu);
  window.loadURL('file://' + __dirname +'/index.html')
  //window.webContents.openDevTools()

  let appIcon = null;
  window.on('close', (e) => {
    if (willQuitApp) {
      window = null;
    } else {
      e.preventDefault();
      window.hide();
    }
    if(appIcon == null){
      let trayImage = null;

      if (platform == 'darwin') {
        trayImage = path.join(__dirname, './images/iconTray.png');
      }
      else if (platform == 'win32') {
        trayImage = path.join(__dirname, './images/iconTray.ico');
      }
      appIcon = new electron.Tray(trayImage);
      const contextMenu = Menu.buildFromTemplate([{
        label:'프로그램 종료',
        role: 'quit'
      },
        {
          label: `화면보이기`,
          click(item, win) {
            window.show();
          }
        }]);
      appIcon.setContextMenu(contextMenu);
      appIcon.on('click', function(){
        window.show();
      });
    }
  });
  window.on('focus', function(){
    if (platform == 'win32') {
      window.flashFrame(false);
      window.setOverlayIcon(null, "");
    }
  });
  ipcMain.on('window-state', (event, arg) => {
    event.returnValue = window.isFocused();
  });
  ipcMain.on('browser-minimize', (event, arg) => {
    //todo 테스트 필요
    if(!window.isVisible()){
      window.minimize();
      if (platform == 'win32') {
        window.setOverlayIcon(__dirname + '/images/ic_new.png', "new mark");
        window.flashFrame(true); // 태스크바에서 깜빡임
        return;
      }
    }
    if(!window.isFocused()){
      if (platform == 'win32') {
        window.setOverlayIcon(__dirname + '/images/ic_new.png', "new mark");
        window.flashFrame(true); // 태스크바에서 깜빡임
        return;
      }
    }
  });
  // 노티 셋팅
  const eNotify = require('electron-notify');
  eNotify.setConfig({
    width: 300,
    height: 75,
    appIcon: path.join(__dirname, 'images/icon.png'),
    displayTime: 6000,
    defaultStyleContainer: {
      backgroundColor: '#fff',
      overflow: 'hidden',
      padding: 8,
      border: '1px solid #CCC',
      fontFamily: 'Arial',
      fontSize: 14,
      position: 'relative',
      lineHeight: '15px'
    },
    defaultStyleAppIcon: {
      overflow: 'hidden',
      float: 'right',
      height: 40,
      width: 40,
      marginLeft: 10,
    },
    defaultStyleImage: {
      overflow: 'hidden',
      float: 'left',
      height: 40,
      width: 40,
      marginRight: 10,
    }
  });

  //노티신호 대응
  ipcMain.on('noti', (event, arg) => {
    eNotify.notify({ title: arg.title
                    , text: arg.lastMessage.length > 10 ? arg.lastMessage.substr(0,10) + '...' : arg.lastMessage
                    , image: arg.targetProfile.indexOf('http') > -1 ? arg.targetProfile :  path.join(__dirname, arg.targetProfile)
                    , onClickFunc: function(){
                        window.webContents.executeJavaScript("togethersTalk.resetCurrentChatRoom()");
                        window.webContents.executeJavaScript("togethersTalk.startChat(null, '"+ arg.targetName
                        + "','"+ arg.targetProfile
                        +"','" + arg.roomType +"','"+ arg.roomId + "');");
                        window.show();
                      }});

  });

  //버전 반환
  ipcMain.on('version-check', (event, arg) => {
    event.returnValue = version;
  });
  ipcMain.on('app-quit', (event, arg) => {
    app.quit();
  });
});

/* 'activate' is emitted when the user clicks the Dock icon (OS X) */
app.on('activate', () => window.show());

/* 'before-quit' is emitted when Electron receives
 * the signal to exit and wants to start closing windows */
app.on('before-quit', () => willQuitApp = true);
