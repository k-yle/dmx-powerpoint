import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as express from 'express';

let win: BrowserWindow;

const port = 15953;

async function prodServer(): Promise<void> {
  return new Promise((resolve): void => {
    console.log('Starting prodution server...');
    const server = express();

    // Rejecting requests from browsers
    server.use((req, res, next) => {
      if (req.get('User-Agent').includes('Electron')) next();
      else res.status(401).send('Go away');
    });
    server.use(express.static(path.resolve(__dirname, '../renderer')));

    server.listen(port, 'localhost', resolve);
  });
}

app.on('ready', async () => {
  if (!process.argv.includes('--dev')) await prodServer();
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL(`http://localhost:${port}`);
  win.webContents.openDevTools();
  win.on('closed', () => { win = null; });
});
