import { StatusBar } from "expo-status-bar";
import Root from "navigation/Root";
import { ThemeProvider } from "providers/ThemeProvider";
import { Provider } from "react-redux";
import { store } from "store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Provider store={store}>
            <Root />
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}
