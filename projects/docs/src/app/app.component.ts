import { Component, Inject, Optional } from '@angular/core';
import { GOLDA_NODES_STATE, GoldaNodeState } from '../../../golda-nodes/src/public_api';

@Component({
  selector: 'golda-docs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'docs';

  constructor(@Optional() @Inject(GOLDA_NODES_STATE) private gNodesState: GoldaNodeState) {
    console.log(this.gNodesState);
  }
}
