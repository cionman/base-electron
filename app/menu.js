'use strict';
const os = require('os');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;
const appName = app.getName();

function sendAction(action) {
	const win = BrowserWindow.getAllWindows()[0];

	if (process.platform === 'darwin') {
		win.restore();
	}

	win.webContents.send(action);
}

const helpSubmenu = [
	{
		label: `&홈페이지`,
		click() {
			shell.openExternal('https://suwoni-codelab.com');
		}
	},
	{
		label: `&인트라넷`,
		click() {
			shell.openExternal('https://intra.martpia.co.kr');
		}
	}
];

let tpl = [
	{
		label: '&편집',
		submenu: [
			{
				label: '실행취소',
				role: 'undo'
			},
			{
				label:'다시실행',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label:'잘라내기',
				role: 'cut'
			},
			{
				label:'복사',
				role: 'copy'
			},
			{
				label:'붙여넣기',
				role: 'paste'
			},
			{
				label:'모두선택',
				role: 'selectall'
			},
			{
				label:'삭제',
				role: 'delete'
			}
		]
	},
	{
		label: '&창',
		role: 'window',
		submenu: [
			{
				label: '&최소화',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: '&닫기',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				type: 'separator'
			},
			{
				role: 'togglefullscreen'
			}
		]
	},

	{
		label: '&사이트',
		role: 'help'
	},
	{
		label:'&피드백',
		submenu:[
			{
                label: '&피드백 작성'
                ,click() {
                shell.openExternal('https://docs.google.com/forms/d/e/1FAIpQLScHgwA2y33No8GlnEourRcjeAPaMtnz1eF_Yc_krDFgt2jD8A/viewform');
            	}
			}
		]
	}

];

if (process.platform === 'darwin') {
	tpl.unshift({
		label: appName,
		submenu: [
			{
				label: `업데이트`,
				click(item, win) {
					const webContents = win.webContents;
					const send = webContents.send.bind(win.webContents);
					send('autoUpdater:check-update');
				}
			},
			{
				role: 'quit'
			}
		]
	});
} else {
	tpl.unshift({
		label: '&파일',
		submenu: [
			{
				label:'프로그램 종료',
				role: 'quit'
			}
		]
	});
	helpSubmenu.push({
		type: 'separator'
	});
}

tpl[tpl.length - 2].submenu = helpSubmenu;

var menu = electron.Menu.buildFromTemplate(tpl);
module.exports = menu;
