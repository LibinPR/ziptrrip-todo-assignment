import React from "react";
import ReactDOM from "react-dom/client";
import TodoDetails from "./pages/TodoDetails";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TodoDetails />
  </React.StrictMode>,
);