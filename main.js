// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const os = require('os-utils');
const path = require('path');

const fs = require('fs');

const root = fs.readdirSync('/');

// This will print all files at the root-level of the disk,
// either '/' or 'C:\'.
console.log(root);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    backgroundColor: 'white',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  setInterval(() => {
    os.cpuUsage(function (v) {
      // console.log('CPU Usage (%): ' + v * 100);
      // console.log('Mem Usage (%): ' + os.freememPercentage() * 100);
      // console.log('Total Mem (GB): ' + os.totalmem() / 1024);
      mainWindow.webContents.send('cpu', v * 100);
      mainWindow.webContents.send('mem', os.freememPercentage() * 100);
      mainWindow.webContents.send('mem', os.totalmem() / 1024);
    });
  }, 1000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
