import { createContext } from "react";
import { nanoid } from "@reduxjs/toolkit";

/**
 * @extends Promise<any>
 */
export class AsyncUI extends Promise {
  constructor(callback, render, key, resolve, reject) {
    let baseResolve, baseReject;
    super((resolve, reject) => {
      baseResolve = resolve;
      baseReject = reject;
      callback?.(resolve, reject);
    });
    this.baseResolve = baseResolve;
    this.baseReject = baseReject;
    this.key = key || nanoid();
    this.resolve = (value) => {
      resolve?.(this, value, this.key) || this.baseResolve(value);
    };
    this.reject = (value) => {
      reject?.(this, value, this.key) || this.baseReject(value);
    };
    this.render = () => render?.(this, key);
  }

  get [Symbol.toStringTag]() {
    return "AsyncUI";
  }
}

/**
 * @type {import("react").Context<AsyncUIContextValue>}
 */
const AsyncUIContext = createContext(null);

export default AsyncUIContext;

/**
 * @typedef {{
 * enqueueUI: (render: (ui: AsyncUI,  options: {key: any: manualRender: boolean}) => React.ReactNode) => AsyncUI;
 * resolveUI: (key: string | number, value: any) => void;
 * rejectUI: (key: string | number, value: any) => void;
 * renderUI: (key: string | number) => void
 * }} AsyncUIContextValue
 */
