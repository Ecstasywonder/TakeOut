import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './AppRouter';

const container = document.getElementById('root');
if (container) {
	const root = createRoot(container);
	root.render(<AppRouter />);
} else {
	// If the root element is missing, log to help debugging in dev
	// (this will appear in the devtools console)
	// eslint-disable-next-line no-console
	console.error('Root element not found: unable to mount React app');
}