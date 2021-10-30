const {
	Menu, MenuItem, app, BrowserWindow, dialog
} = require('electron');
const isDev = require('electron-is-dev');
const {
	autoUpdater
} = require("electron-updater");
const DiscordRPC = require('discord-rpc');

//const {app, BrowserWindow} = require('electron');
const path = require('path');

let pluginName
switch (process.platform) {
	case 'win32':
		pluginName = 'flash/pepflashplayer64_32_0_0_303.dll'
		break
	case 'darwin':
		pluginName = 'flash/PepperFlashPlayer.plugin'
		break
	case 'linux':
		pluginName = 'flash/libpepflashplayer.so'
		break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

autoUpdater.checkForUpdatesAndNotify();
let mainWindow;

function clearCache() {
	mainWindow.webContents.session.clearCache();
}

const menuTemplate = [
    {
		label: 'Fullscreen',
		accelerator: 'CmdOrCtrl+F',
		click: () => {
			mainWindow.setFullScreen(!mainWindow.isFullScreen());
		}
    },
    {
		label: 'Clear Cache',
		click: () => {
			mainWindow.webContents.session.clearCache();
		}    
	},
    {
		label: 'Reload',
		click: () => {
			mainWindow.loadURL('https://play.cpreloaded.net/');
		}    
	}
];


function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		title: "Connecting...",
		icon: __dirname + '/favicon.ico',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			plugins: true
		}
	});

	mainWindow.setMenu(null);
	// New URL!
	if (process.platform == 'darwin') {
		menuTemplate.unshift({label: ''});
	}
	mainWindow.loadURL('https://play.cpreloaded.net/');

  const clientId = '903074746294501376'; DiscordRPC.register(clientId); const rpc = new DiscordRPC.Client({ transport: 'ipc' }); const startTimestamp = new Date();
  rpc.on('ready', () => {
    rpc.setActivity({
      details: `Desktop Client`, 
      state: `Exploring the epic island of Club Penguin: Reloaded!`, 
      startTimestamp, 
      largeImageKey: `icon`, 
		});
	});
	rpc.login({
		clientId
	}).catch(console.error);

	mainWindow.on('closed', function() {
		mainWindow = null
	});

}

app.on('ready', () => {
	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
	createWindow()
	Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', function() {
	app.quit();
});

app.on('activate', function() {
	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
	if (mainWindow === null) createWindow();
	Menu.setApplicationMenu(menu);
});