/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const { app, BrowserWindow } = require("electron");
const { existsSync } = require("original-fs");
const { join, resolve } = require("node:path");

const express = require("express");
const express_app = express();

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

  express_app.get("/window/trafficLights/:action", (req, res) => {
    console.log(`window action ${req.params.action} called`);
    if (req.params.action === undefined) {
      res.status(400);
      return;
    }

    switch (req.params.action) {
      case "close":
        win.close();
        break;

      case "minimize":
        win.minimize();
        win.webContents.reloadIgnoringCache();
        break;

      case "toggleFullscreen":
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
        win.webContents.reloadIgnoringCache();
        break;
      default:
        res.status(400);
        return;
    }

    res.status(200);
  });

  express_app.listen(8081);
};

app.on("ready", createWindow);
