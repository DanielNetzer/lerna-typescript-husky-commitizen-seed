
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { GoldaNode } from './golda-nodes.model';

export interface GoldaNodeState extends EntityState<GoldaNode> {
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'goldaNodes' })
export class GoldaNodesStore extends EntityStore<GoldaNodeState, GoldaNode> {
    constructor() {
        super();
    }
}
