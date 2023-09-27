import React from 'react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App className='app'/>);
