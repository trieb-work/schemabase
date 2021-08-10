import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";

const loggerLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  operation.setContext({ start: new Date() });
  return forward(operation).map((response) => {
    const responseTime =
      new Date().getTime() -
      new Date(operation.getContext()["start"]).getTime();
    console.log(`GraphQL Response took: ${responseTime}`);
    return response;
  });
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message }) =>
      console.log(`GraphQL Error: ${message}`),
    );
  }
  if (networkError) {
    console.log(`Network Error: ${networkError.message}`);
  }
});

export type GraphqlClient = ApolloClient<NormalizedCacheObject>;
/**
 * @param uri The URI where we connect to
 * @param bearerToken The JWT token to authenticate the client. Is optional
 */
export const createGraphqlClient = (
  uri: string,
  bearerToken?: string,
): GraphqlClient => {
  const token = bearerToken;

  const links = ApolloLink.from([
    loggerLink,
    new RetryLink({
      attempts: {
        max: 3,
      },
    }),
    errorLink,
    new HttpLink({
      fetch,
      uri,
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    }),
  ]);

  return new ApolloClient({
    link: links,
    cache: new InMemoryCache(),
  });
};
