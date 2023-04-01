import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import queryClient from "../lib/query";
import "../styles/globals.css";
import { CartProvider } from "../components/CartContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <CartProvider>
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Component {...pageProps} />
        </QueryClientProvider>
        </CartProvider>
    );
}

export default MyApp;