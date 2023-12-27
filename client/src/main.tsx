import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup } from "./dojo/setup.ts";
import { DojoProvider } from "./DojoContext.tsx";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
} from "@apollo/client";

const client = new ApolloClient({
    uri: import.meta.env.VITE_PUBLIC_TORII,
    cache: new InMemoryCache(),
});

const setupResult = await setup();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <DojoProvider value={setupResult}>
                <App />
            </DojoProvider>
        </React.StrictMode>
    </ApolloProvider>
);
