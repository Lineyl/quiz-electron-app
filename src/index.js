import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "logo.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  win.setMenuBarVisibility(false);
  win.setTitle("Олимпиада");
  win.loadFile("src/index.html");

  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'r') {
      event.preventDefault();
    }

    if (input.control && input.key.toLowerCase() === 'к') {
      event.preventDefault();
    }

    if (input.control && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault();
    }

    if (input.control && input.shift && input.key.toLowerCase() === 'ш') {
      event.preventDefault();
    }
  });
}

ipcMain.handle("save-results", async (event, data) => {
  try {
    const resultsDir = path.join(app.getPath('documents'), 'Олимпиада');

    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const fileName = `${data.group}_${data.surname}_${data.name}_${Date.now()}.json`;
    const filePath = path.join(resultsDir, fileName);

    const fileData = {
      surname: data.surname,
      name: data.name,
      group: data.group,
      results: data.results,
      timestamp: Date.now(),
    }

    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

    return true;
  } catch (err) {
    return false;
  }
})

app.whenReady().then(() => {createWindow()});
app.on("window-all-closed", () => app.quit());