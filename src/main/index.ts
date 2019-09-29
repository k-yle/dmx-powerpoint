import {
  app, BrowserWindow, Tray, Menu,
} from 'electron';
import * as path from 'path';
import * as express from 'express';

const port = 15953;
const icon = path.join(__dirname, '../../icon.png');

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

let tray: Tray;
let win: BrowserWindow;

const create = {
  async window(): Promise<void> {
    if (!process.argv.includes('--dev')) await prodServer();
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
      icon,
    });
    win.loadURL(`http://localhost:${port}`);
    win.webContents.openDevTools();
    win.setMenu(null);

    win.on('minimize', (event) => {
      event.preventDefault();
      win.hide();
    });
    win.on('close', (event) => {
      event.preventDefault();
      win.hide();
    });
    win.on('closed', () => { win = null; });
  },
  tray(): void {
    tray = new Tray(icon);
    tray.setToolTip('ArtNet PowerPoint control is enabled. Click to open settings.');
    tray.on('click', (): void => {
      if (win.isVisible()) win.hide();
      else { win.show(); win.focus(); }
    });
    tray.setContextMenu(Menu.buildFromTemplate([{
      label: 'Quit',
      click(): void { app.exit(0); },
    }]));
  },
};

app.on('ready', async () => {
  create.tray();
  await create.window();
});

app.on('window-all-closed', app.quit);
