import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';

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
  public app: expressProxy.Application;

  initialize() {
    this.app = express.def();
    const config = this.getConfig();
    enableProdMode();

    // * NOTE :: leave this as require() since this file is built Dynamically from webpack
    // TODO: path for main file should be dynamic from configuration.
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/server/main');

    // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
    this.app.engine('html', ngExpressEngine({
      bootstrap: AppServerModuleNgFactory,
      providers: [
        provideModuleMap(LAZY_MODULE_MAP)
      ]
    }));
    // sd
    this.app.set('view engine', 'html');
    this.app.set('views', this.DIST_FOLDER);

    // Example Express Rest API endpoints
    // app.get('/api/**', (req, res) => { });
    // Server static files from /browser
    this.app.get('*.*', express.def.static(this.DIST_FOLDER, {
      maxAge: '1y'
    }));

    // All regular routes use the Universal engine
    this.app.get('*', (req, res) => {
      res.render('index', { req });
    });

    // Start up the Node server
    this.app.listen(config.PORT, () => {
      console.log(`Node Express server listening on http://localhost:${config.PORT}`);
    });
  }

  getConfig() {
    // TODO: get application config here using bootstrap/get-config service
    return {
      PORT: process.env.PORT || 4000
    };
  }

}

export const GoldaEngine = Engine;
