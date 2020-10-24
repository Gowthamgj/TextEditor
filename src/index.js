import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import EventEmitter from "./ee";
export const emitter = new EventEmitter();

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
