import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "buildResources", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "../electron/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  Menu.setApplicationMenu(null);

  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow?.webContents.closeDevTools();
  });
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (
      (input.control || input.meta) &&
      (input.key.toLowerCase() === "i" || input.key.toLowerCase() === "j")
    ) {
      event.preventDefault();
    }
  });
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
