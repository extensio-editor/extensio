/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const { app, BrowserWindow, dialog } = require("electron");
const { existsSync } = require("original-fs");
const { join, resolve } = require("node:path");

const express = require("express");
const express_app = express();

express_app.use(express.json());
express_app.use(express.urlencoded());

express_app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080"); // Allow requests from this origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  ); // Allowed HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allowed headers
  res.setHeader("Access-Control-Allow-Credentials", true); // Allow cookies to be sent
  if (req.method === "OPTIONS") {
    // Handle preflight requests
    res.sendStatus(200);
  } else {
    next();
  }
});

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

  express_app.post("/project/new", (req, res) => {
    console.log(req.body);
    res.status(200);
  });

  express_app.get("/project/:action", async (req, res) => {
    console.log("Showing folder open dialogue");

    const dir = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });

    if (dir.canceled) {
      console.log("cancelled by user");
      res.status(202).json(dir);
      return;
    } else {
      console.log(dir);
      console.log(`selected ${dir.filePaths[0]}`);
      res.status(200).json(dir);
      return;
    }
  });

  express_app.listen(8081);
};

app.on("ready", createWindow);
