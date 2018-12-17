import { BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { NgModule, Optional, Inject } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RouterModule } from '@angular/router';

const STATE_KEY = makeStateKey<any>('apollo.state');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserTransferStateModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  cache: InMemoryCache;

  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    private readonly transferState: TransferState,
  ) {
    this.cache = new InMemoryCache();
    const isBrowser = this.transferState.hasKey<any>(STATE_KEY);

    apollo.create({
      link: httpLink.create({ uri: '/api/graphql' }),
      cache: this.cache,
      ...(isBrowser
        ? {
          // queries with `forceFetch` enabled will be delayed
          ssrForceFetchDelay: 200,
        }
        : {
          // avoid to run twice queries with `forceFetch` enabled
          ssrMode: true,
        })
    });

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  onServer() {
    this.transferState.onSerialize(STATE_KEY, () => {
      return this.cache.extract();
    });
  }

  onBrowser() {
    console.log('BROWSER');
    const state = this.transferState.get<any>(STATE_KEY, null);
    this.cache.restore(state);
  }
}
