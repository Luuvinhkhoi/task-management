import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import { store } from './store/store';
const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Dùng createRoot()
root.render(
    <Provider store={store}>
      <App />
    </Provider>
);
