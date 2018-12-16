import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { GoldaNodeState, GoldaNodesStore } from './golda-nodes.store';
import { GoldaNode } from './golda-nodes.model';

@Injectable({ providedIn: 'root' })
export class GoldaNodesQuery extends QueryEntity<GoldaNodeState, GoldaNode> {

    constructor(protected store: GoldaNodesStore) {
        super(store);
    }
}
