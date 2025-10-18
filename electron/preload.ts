/* eslint-disable */
import { contextBridge, ipcRenderer } from "electron";

interface ElectronAPI {
  send: (channel: string, data?: any) => void;
  on: (channel: string, func: (...args: any[]) => void) => void;
}

contextBridge.exposeInMainWorld("electron", {
  send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  on: (channel: string, func: (...args: any[]) => void) =>
    ipcRenderer.on(
      channel,
      (event: Electron.IpcRendererEvent, ...args: any[]) => func(...args),
    ),
} as ElectronAPI);
