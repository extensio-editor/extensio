/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const { app, BrowserWindow, dialog } = require("electron");
const {
  existsSync,
  writeFileSync,
  mkdirSync,
  appendFileSync,
  readdirSync,
  copyFileSync,
} = require("node:fs");
const { stat } = require("node:fs").promises;
const { join, resolve } = require("node:path");

const commandExists = require("command-exists-promise");
const RPCclient = require("discord-rich-presence")("1215770435887698042");

const { exec } = require("child_process");

require("dotenv").config();

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

let extensions = [];

const express = require("express");
const express_app = express();
let app_server;
if (isProd) {
  app_server = express();
}

express_app.use(express.json());
express_app.use(express.urlencoded());

if (isProd) {
  app_server.use(express.static(join(__filename, "..")));
  app_server.get("/", (req, res) =>
    res.sendFile(join(__filename, "..", "index.html"))
  );
} else {
  console.log(
    "====================\n\nRunning in development mode!\n\n===================="
  );
}

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
  if (isProd) {
    return resolve(join(__filename, "..", fileLoc));
  } else {
    return resolve(join("public", fileLoc));
  }
};

const extensionFolderPath = join(
  require("os").homedir(),
  ".extensio",
  "extensions"
);

const discoverExtensions = () => {
  return readdirSync(extensionFolderPath)
    .filter((file) => file.endsWith(".js"))
    .map((file) => join(extensionFolderPath, file));
};

const loadExtensions = () => {
  const extensions = discoverExtensions();
  const reqs = [];
  extensions.forEach((extension) => {
    reqs.push(require(extension));
  });
  return reqs;
};

let currentProjectFolder = require("os").homedir();

const createWindow = () => {
  const icon = getIconLocation();
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    minWidth: 400,
    minHeight: 610,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame: false,
    backgroundColor: "#000",
  });

  if (isProd) {
    win.hide();
  }

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
    if (!req.body["project"]) {
      console.error("You did something wrong");
      res.status(400);
      return;
    }

    console.log(req.body["project"]);

    let projectRoot = req.body["project"]["location"]
      ? req.body["project"]["location"]
      : join(require("os").homedir(), "desktop");

    if (!req.body["project"]["isRoot"]) {
      projectRoot = join(projectRoot, req.body["project"]["name"]);
    }

    let shouldReturn = false;

    if (!existsSync(projectRoot)) {
      mkdirSync(projectRoot, { recursive: true });
    }

    process.chdir(projectRoot);

    if (req.body["project"]["createGit"]) {
      commandExists("git").then((exists) => {
        if (!exists) {
          res.status(404).json({ message: "Git is not installed!" });
          return (shouldReturn = true);
        }

        exec(`git init`, (error, stdout, stderr) => {
          if (error) {
            console.error(`error: ${error.message}`);
            res.status(500).json({ message: error.message });
            shouldReturn = true;
            return;
          }

          if (stderr) {
            console.error(`error: ${stderr}`);
            res.status(500).json({ message: stderr });
            shouldReturn = true;
            return;
          }

          writeFileSync(
            join(process.cwd(), ".git", "description"),
            req.body["project"]["name"],
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: err });
                shouldReturn = true;
                return;
              }
            }
          );

          appendFileSync(
            join(process.cwd(), ".git", "info", "exclude"),
            "#exclude any files that are marked as private\n*.private",
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: err });
                shouldReturn = true;
                return;
              }
            }
          );
        });
      });
    }

    if (shouldReturn) return;

    res.status(200);
  });

  express_app.get("/extensions/get", (req, res) => {
    res.json(extensions);
  });

  express_app.get("/project/get", (req, res) => {
    res.json({
      name:
        currentProjectFolder === require("os").homedir()
          ? undefined
          : currentProjectFolder.split(require("path").sep).pop(),
    });
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
      currentProjectFolder = dir.filePaths[0];
      res.status(200).json(dir);
      win.loadURL("http://localhost:8080/project");
      return;
    }
  });

  express_app.get("/rpc/update", (req, res) => {
    RPCclient.updatePresence({
      details: req.query.doing || "Idle",
      state:
        req.query.project ||
        currentProjectFolder.split(require("path").sep).pop() ||
        "No project opened",
      largeImageKey:
        req.query.theme === "light" ? "extensio_light" : "extensio_dark",
      smallImageKey: isDev ? "extensio_devbuild" : undefined,
      smallImageText: isDev ? "Development build" : undefined,
      instance: true,
      startTimestamp: Date.now(),
      largeImageText: "Extensio code editor",
    });
    res.status(200);
  });

  express_app.get("/files", async (req, res) => {
    const files = readdirSync(currentProjectFolder);
    let data = {};
    await Promise.all(
      files.map(async (file) => {
        const stats = await stat(join(currentProjectFolder, file));
        data[file] = stats.isDirectory();
      })
    );
    res.json(data);
  });

  express_app.listen(8081, () => {
    console.log("Started backend server...");
    RPCclient.updatePresence({
      details: "Idle",
      state: "No project opened",
      largeImageKey: "extensio_dark",
      smallImageKey: isDev ? "extensio_devbuild" : undefined,
      smallImageText: isDev ? "Development build" : undefined,
      instance: false,
      startTimestamp: Date.now(),
      largeImageText: "Extensio code editor",
    });
    if (isProd) {
      app_server.listen(8080, () => {
        console.log("Started app server...");
        win.show();
      });
    }
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Directly from https://github.com/electron-archive/grunt-electron-installer#handling-squirrel-events
const handleStartupEvent = () => {
  if (process.platform !== "win32") {
    return false;
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case "--squirrel-install":
    case "--squirrel-updated":
      try {
        // Copy base extensions to the extensions folder, overwrite if it already exists

        // read the extension folder
        // eslint-disable-next-line no-case-declarations
        const extensionFolder = join("extensions");

        if (!existsSync(extensionFolderPath)) {
          mkdirSync(extensionFolderPath, { recursive: true });
        }

        // Copy the files.
        // eslint-disable-next-line no-case-declarations
        const extensionFiles = readdirSync(extensionFolder);
        extensionFiles.forEach((file) => {
          copyFileSync(
            join(extensionFolder, file),
            join(extensionFolderPath, file)
          );
        });

        // Always quit when done
        app.quit();
      } catch (e) {
        console.log("Error copying extensions, continuing regardless...");
      }

      return true;
    case "--squirrel-uninstall":
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case "--squirrel-obsolete":
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}

app.on("ready", () => {
  createWindow();
  loadExtensions();

  console.log("Current directory: " + __dirname);

  require(isProd ? "../../../api/extensionAPI.js" : "./api/extensionAPI.js")
    .getRegisteredExtensions()
    .forEach((item) => {
      extensions.push(item);
    });
});
