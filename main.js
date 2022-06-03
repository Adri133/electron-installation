const { app, BrowserWindow, Menu, ipcMain } =  require('electron')
const path = require('path')
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New item',
        click() {
          createNewWindow()
        }
      },
      {
        label: 'Quit',
        accelerator: 'CommandOrControl+Q',
        click() {
          app.quit()
        }
      },
    ]
  }
]
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  win.loadFile('index.html')
  
}

const createNewWindow = () => {
  const newWin = new BrowserWindow({
    width: 200,
    height: 300,
    title: 'New window',
    preload: 'preload-add-item.js',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  newWin.loadFile('template.html')
  
}
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit()
})

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform ==='darwin' ? 'Command+I' : 'Ctrl+I',

        click(item, focusedWindow) {
          focusedWindow.webContents.toggleDevTools()
        }
      }, 
      {
        role: 'reload'
      }
    ]
  })
}
ipcMain.on('item:add', (e, item) => {
  const wins = BrowserWindow.getAllWindows()
  wins[1].webContents.send('item:add', item)
  wins[0].close()
})