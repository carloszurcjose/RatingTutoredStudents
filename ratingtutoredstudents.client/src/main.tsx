import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
const theme = createTheme({
    palette: { mode: "light", primary: { main: "#2563eb" } },
    shape: { borderRadius: 12 },
});


const root = document.getElementById('root') as HTMLElement; // type assertion
createRoot(root).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
);
