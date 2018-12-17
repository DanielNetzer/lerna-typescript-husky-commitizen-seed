import { BrowserModule, BrowserTransferStateModule, makeStateKey, TransferState } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

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
    HttpLinkModule
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
    console.log('INIT?');
    apollo.create({
      link: httpLink.create({ uri: '/graphql' }),
      cache: this.cache,
    });

    const isBrowser = this.transferState.hasKey<any>(STATE_KEY);

    if (isBrowser) {
      this.onBrowser();
    } else {
      this.onServer();
    }
  }

  onServer() {
    console.log('SERVER');
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
