/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}

interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  electron: {
    send: (channel: string, data?: any) => void;
    on: (channel: string, func: (...args: any[]) => void) => void;
    discord: {
      updateActivity: (details: string, state: string) => void;
    };
  };
}
