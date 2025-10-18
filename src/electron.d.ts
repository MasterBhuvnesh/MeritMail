/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ElectronAPI {
  send: (channel: string, data?: any) => void;
  on: (channel: string, func: (...args: any[]) => void) => void;
  discord: {
    updateActivity: (details: string, state: string) => void;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
