// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'addT'
  | 'addC'
  | 'addS'
  | 'getT'
  | 'getC'
  | 'getS'
  | 'deleteT'
  | 'deleteC'
  | 'deleteS'
  | 'getConfig'
  | 'updateConfig'
  | 'getTCSEntries'
  | 'updateTimetable'
  | 'validateTimetable';

const electronHandler = {
  ipcRenderer: {
    send(channel: Channels, args: unknown[] = []) {
      ipcRenderer.send(channel, args);
    },
    invoke(channel: Channels, args: unknown[] = []) {
      return ipcRenderer.invoke(channel, args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
