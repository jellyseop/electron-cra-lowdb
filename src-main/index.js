const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const { initConnection } = require("../backend/db");
//const fs = require("fs");
//const { ipcMain } = require("electron/main");

function createWindow() {
  /*
   * 넓이 1920에 높이 1080의 FHD 풀스크린 앱을 실행시킵니다.
   * */
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  /*
   * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
   * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
   * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
   * */
  const startUrl =
    "http://localhost:3000" ||
    url.format({
      pathname: path.join(__dirname, "/../public/index.html"),
      protocol: "file:",
      slashes: true,
    });

  /*
   * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
   * */
  win.loadURL(startUrl);

  win.webContents.on("did-finish-load", () => {
    const data = initConnection();
    win.webContents.send("ping", data);
  });
}

app.whenReady().then(createWindow);
