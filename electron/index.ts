// eslint-disable-next-line import/no-extraneous-dependencies
import { Menu } from 'electron';
import { menubar } from 'menubar';
import { join } from 'path';

const DEV = process.argv.includes('--dev');

const HOST = DEV
  ? { index: 'http://localhost:15953' }
  : { dir: join(__dirname, '../client') };

const mb = menubar({
  ...HOST,
  browserWindow: {
    alwaysOnTop: DEV,
    // transparent: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  },
  tooltip: 'DMX PowerPoint control is enabled. Click to open settings.',
  icon: join(__dirname, '../client/icon.png'),
  preloadWindow: true,
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
});

mb.on('after-create-window', () => {
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: (): void => mb.app.quit() },
  ]);
  mb.tray.on('right-click', () => {
    mb.tray.popUpContextMenu(contextMenu);
  });
});
