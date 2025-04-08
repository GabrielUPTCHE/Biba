const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const fsAsync = require('fs').promises;

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  ipcMain.handle('validate-user', (event, { name, password }) => {
    const usersPath = path.join(__dirname, 'data', 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

    const user = usersData.find(
      u => u.name === name && u.password === password
    );

    return user || null;
  });

  ipcMain.handle('get-files', () => {
    const filesPath = path.join(__dirname, 'data', 'files.json');
    const files = JSON.parse(fs.readFileSync(filesPath, 'utf-8'));
    return files;
  });
  
  ipcMain.handle('create-user', (event, newUser) => {
    const usersPath = path.join(__dirname, 'data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  
    const exists = users.some(u => u.name === newUser.name);
    if (exists) {
      return { success: false, message: 'El nombre de usuario ya existe.' };
    }
  
    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
    return { success: true };
  });
  ipcMain.handle('read-file-content', async (event, filePath) => {
    try {
      const content = await fsAsync.readFile(filePath, 'utf8');
      return content;
    } catch (err) {
      console.error('Error leyendo archivo:', err);
      return 'Error al leer archivo';
    }
  });
  
  ipcMain.handle('save-file-content', async (event, responseObject) => {
    try {
      const absolutePath = path.resolve(__dirname, responseObject.filePath);
      await fsAsync.writeFile(absolutePath, responseObject.newContent, 'utf8');
      return true;
    } catch (err) {
      console.error('Error guardando archivo:', err);
      return false;
    }
  });
  

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
