// main.jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from './contexts/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);