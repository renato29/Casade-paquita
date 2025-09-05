import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css';


// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// i18n (se der erro aqui, comente esta linha TEMPORARIAMENTE e teste de novo)
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
