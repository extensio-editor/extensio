/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const { app, BrowserWindow, ipcMain } = require("electron");
const { existsSync } = require("original-fs");
const { join, resolve } = require("node:path");

const getIconLocation = () => {
  const fileLoc = "img/icons/favicon.ico";
  const prodLocation = join(__dirname, fileLoc);
  if (existsSync(prodLocation)) {
    return resolve(fileLoc);
  } else {
    return resolve(join("public", fileLoc));
  }
};

const createWindow = () => {
  const icon = getIconLocation();
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
  });

  win.setIcon(icon);

  win.loadURL("http://localhost:8080");

  ipcMain.on("close", () => {
    app.quit();
  });

  ipcMain.on("minimize", () => {
    win.minimize();
  });

  ipcMain.on("fullscreen", () => {
    win.setFullScreen(!win.isFullScreen);
  });
};

app.on("ready", createWindow);
