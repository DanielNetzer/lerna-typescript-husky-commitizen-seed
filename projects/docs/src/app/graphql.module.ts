import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const STATE_KEY = makeStateKey<any>('apollo.state');
const uri = '/graphql';

export function createApollo(httpLink: HttpLink, transferState: TransferState) {

  const isBrowser = transferState.hasKey<any>(STATE_KEY);

  console.log(isBrowser);

  return {
    link: httpLink.create({ uri }),
    cache: new InMemoryCache(),
    ...(isBrowser
      ? {
        // queries with `forceFetch` enabled will be delayed
        ssrForceFetchDelay: 200,
      }
      : {
        // avoid to run twice queries with `forceFetch` enabled
        ssrMode: true,
      }),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, TransferState],
    },
  ],
})
export class GraphQLModule { }
