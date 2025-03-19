import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./app/store";
import { BrowserRouter as Router } from "react-router-dom";
import { TranslationProvider } from "./context/TranslationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Provider store={store}>
            <TranslationProvider>
                <App />
            </TranslationProvider>
        </Provider>
    </Router>
);
