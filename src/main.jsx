import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css"
import "./styles/utilities.css"
import App from './App.jsx'

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap";
document.head.appendChild(link);

createRoot(document.getElementById("root")).render(

  <StrictMode>
    <App />
  </StrictMode>

);

