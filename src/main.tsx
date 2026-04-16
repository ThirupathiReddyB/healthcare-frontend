import React from "react";
import "./global.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.ts";
import {
  QueryClientProvider,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { persistor, store } from "./state/store.ts";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // turns retries off
      refetchOnWindowFocus: true,
      retry: 1,
      refetchOnReconnect: false,
      retryOnMount: false,
      staleTime: 0,
      refetchInterval: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      return error;
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              <ToastContainer position="top-center" />
            </QueryClientProvider>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
