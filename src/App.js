import React, { useEffect } from "react";
import usePersistedState from "use-persisted-state-hook";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  split,
  HttpLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { useAuth0 } from "@auth0/auth0-react";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import { ThemeProvider } from "atomize";

import Login from "./components/Login";
import Track from "./components/App";

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

// 1. Create a client engine instance
const engine = new Styletron();

const theme = {
  grid: {
    gutterWidth: 0
  }
};

function App() {
  const [auth, setAuth] = usePersistedState("auth", {
    isAuthenticated: false,
    token: null,
    user: null
  });
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently();
      setAuth({
        isAuthenticated: true,
        token,
        user
      });
      // store the key
      // check if the key is valid? Logout if not
    };

    isAuthenticated && getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const httpLink = new HttpLink({
    uri: `https://track.wildcodefoundation.org/v1/graphql`,
    headers: {
      "Authorization": `Bearer ${auth.token}`,
      "x-hasura-user-id": auth.user.sub
    },
  });
  const wsLink = new WebSocketLink({
    uri: `ws://track.wildcodefoundation.org/v1/graphql`,
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: async () => ({
        headers: {
          "Authorization": `Bearer ${auth.token}`,
          "x-hasura-user-id": auth.user.sub
        },
      }),
    },
  });
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  // Instantiate client
  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  if (!auth.isAuthenticated) {
    return <Login />;
  } else {
    return (
      <ApolloProvider client={client}>
          <StyletronProvider  value={engine} debug={debug} debugAfterHydration>
            <ThemeProvider theme={theme}>
              <Track />
            </ThemeProvider>
        </StyletronProvider>
      </ApolloProvider>
    );
  }
}

export default App;
