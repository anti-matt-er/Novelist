const { app, BrowserWindow } = require('electron');
const { NoEmitOnErrorsPlugin } = require('webpack');

function createWindow () {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.on('closed', function () {
        win = null
    })

    win.loadFile('index.html');

    win.webContents.openDevTools();
}
    
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (win === null) {
        createWindow()
    }
});