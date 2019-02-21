import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
import * as url from 'url';

interface ProcessEnv {
    [key: string]: any;
}
const proccess_env: ProcessEnv = process.env;
proccess_env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

let win: BrowserWindow = null;

// detect serve mode
const args = process.argv.slice(1);
const serve: boolean = args.some(val => val === '--serve');

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });

    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4200');
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, `/dist/index.html`),
                protocol: 'file:',
                slashes: true
            })
        );
    }
    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

// Start/end the app
try {
    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', () => {
        if (win === null) {
            createWindow();
        }
    });
} catch (e) {
    console.log(e);
}
