export interface GoldaNode {
    id: string;
    children: string[];
    parent: string;
    // Reserved for plugins who wish to extend other nodes.
    fields: Object;
    internal: {
        contentDigest: string;
        // Optional media type (https://en.wikipedia.org/wiki/Media_type) to indicate
        // to transformer plugins this node has data they can further process.
        mediaType: string;
        // A globally unique node type chosen by the plugin owner.
        type: string;
        // The plugin which created this node.
        owner: string;
        // Stores which plugins created which fields.
        fieldOwners: Object;
        // Optional field exposing the raw content for this node
        // that transformer plugins can take and further process.
        content: string;
    };
}

export const createGoldaNode = ({
    id = null,
    children = [],
    parent = null,
    fields = {},
    internal: {
        contentDigest = null,
        mediaType = null,
        type = null,
        owner = null,
        fieldOwners = {},
        content = null
    }
}: GoldaNode): GoldaNode => {
    return {
        id,
        children,
        parent,
        fields,
        internal: {
            contentDigest,
            mediaType,
            type,
            owner,
            fieldOwners,
            content
        }
    };
};
