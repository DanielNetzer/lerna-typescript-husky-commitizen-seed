import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';
import { GoldaNodesQuery, GoldaNodesStore, createGoldaNode, GOLDA_NODES_STATE } from '../golda-nodes/src/public_api';

// 1. get the client config and iterate over data source/plugins
// 2. create an Akita store for the data nodes
// 3. inject the entire Akita Module when server bootstrap to the client

const gNodesStore = new GoldaNodesStore();
gNodesStore.add(createGoldaNode({
  id: 'test', children: [], parent: null, fields: {},
  internal: {
    content: null,
    contentDigest: null,
    mediaType: null,
    fieldOwners: [],
    type: 'test',
    owner: null
  }
}));

const gNodesQuery = new GoldaNodesQuery(gNodesStore);

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
    {
      provide: GOLDA_NODES_STATE,
      useValue: gNodesQuery.getAll()
    }
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Server static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});