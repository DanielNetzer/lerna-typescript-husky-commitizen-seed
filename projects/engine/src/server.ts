import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';

// apollo server
import { ApolloServer, gql } from 'apollo-server-express';

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { join } from 'path';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as expressProxy from 'express';

namespace express {
  export const def = expressProxy;
}

class Engine {

  private DIST_FOLDER = join(process.cwd(), 'dist/browser');

  constructor() {
    const expressApp = this.initializeExpressApp({ config: 'TODO!' });
    this.initializeApolloServer(expressApp);
  }

  private initializeApolloServer(app: expressProxy.Express) {
    // Construct a schema, using GraphQL schema language
    const typeDefs =
      gql`
        type Query {
          hello: String
        }
        `;

    // Provide resolver functions for your schema fields
    const resolvers = {
      Query: {
        hello: () => 'Hello world!',
      },
    };

    const server = new ApolloServer({ typeDefs, resolvers });

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  }

  private initializeExpressApp(expressConfig: unknown) {

    const app = express.def();
    enableProdMode();

    // * NOTE :: leave this as require() since this file is built Dynamically from webpack
    // TODO: path for main file should be dynamic from configuration.
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/server/main');

    // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
    app.engine('html', ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [
        provideModuleMap(LAZY_MODULE_MAP)
      ]
    }));

    app.set('view engine', 'html');
    app.set('views', this.DIST_FOLDER);

    // Example Express Rest API endpoints
    // app.get('/api/**', (req, res) => { });
    // Server static files from /browser
    app.get('*.*', express.def.static(this.DIST_FOLDER, {
      maxAge: '1y'
    }));

    // All regular routes use the Universal engine
    app.get('*', (req, res) => {
      res.render('index', { req });
    });

    return app;
  }

  getConfig() {
    // TODO: get application config here using bootstrap/get-config service
    return {
      PORT: process.env.PORT || 4000
    };
  }

}

export const GoldaEngine = Engine;
