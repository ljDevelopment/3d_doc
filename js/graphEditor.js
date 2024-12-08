import SigmaEvents from './sigmaEvents.js';
import Utils from './utils.js';

export default class GraphEditor {

    static STATES = {
        idle : 'idle', 
        edit : 'edit', 
        addNode : 'addNode', 
        moveNode: 'moveNode', 
        removeNode : 'removeNode', 
        addEdge : 'addEdge', 
        removeEdge : 'removeEdge', 
    }

    #graph
    #sigmaEvents
    #state
    #clicked
    #selected 

    constructor(graph, sigmaEvents) {

        this.#graph = graph;
        this.#sigmaEvents = sigmaEvents;
        this.#state = GraphEditor.STATES.idle;
        this.#clicked = {};
        this.#selected = new Set();

        sigmaEvents.addListener(SigmaEvents.clickStage, this.#onSigmaEvent.bind(this));
        sigmaEvents.addListener(SigmaEvents.clickNode, this.#onSigmaEvent.bind(this));
        sigmaEvents.addListener(SigmaEvents.clickEdge, this.#onSigmaEvent.bind(this));
    }


    get state() { return this.#state; }
    set state(value) { this.#state = value; this.#setClicked(); }
    get selected() { return Array.from(this.#selected).map(
        (node) => {
            const attributes = this.getNodeAtrributes({node});
            return { key : node, attributes };
        }
    ); }
    setAttribute(attr, value) {
        const { node, edge } = this.#clicked;
        if (node) {
            this.#graph.setNodeAttribute(node, attr, value);
        } else if (edge) {
            this.#graph.setEdgeAttribute(edge, attr, value);
        }
    }
    setNodeAtrribute({ node, attr, value }) { this.#graph.setNodeAttribute(node, attr, value); }
    getNodeAtrributes({ node }) { return this.#graph.getNodeAttributes(node); }
    setEdgeAtrribute({ node, attr, value }) { this.#graph.setEdgeAttribute(node, attr, value); }
    getEdgeAtrributes({ edge }) { return this.#graph.getEdgeAttributes(edge); }
    isNodeSelected(key) { return this.#selected.has(key); }

    #onSigmaEvent(s, eventType, evt) {
        
        if (this.state === GraphEditor.STATES.idle) {
            this.#setClicked(evt);
            return;
        }

        switch (eventType) {
            
            case SigmaEvents.clickStage: {
                switch (this.state) {
                    case GraphEditor.STATES.addNode: {

                        const { x, y } = evt.event;
                        const coords = s.sigma.viewportToGraph({ x, y });
                        this.#graph.addNode(Utils.generateUUID(), { size: 10, x: coords.x, y: coords.y });
                        break;
                    }
                    case GraphEditor.STATES.moveNode: {
                        if (!this.#clicked.node) { return; }
                        const { x, y } = evt.event;
                        const coords = s.sigma.viewportToGraph({ x, y });
                        this.setNodeAtrribute({node: this.#clicked.node, attr: 'x', value: coords.x});
                        this.setNodeAtrribute({node: this.#clicked.node, attr: 'y', value: coords.y});
                    }
                }
                break;
            }
            case SigmaEvents.clickNode: {

                const { node } = evt;

                switch (this.state) {
                    case GraphEditor.STATES.removeNode: {
                        this.#graph.dropNode(node);
                        break;
                    }
                    case GraphEditor.STATES.addEdge: {
                        if (!this.#clicked.node) {
                            this.#setClicked({ node });
                        } else {
                            this.#graph.addEdge(this.#clicked.node, node);
                            this.#setClicked();
                        }
                        break;
                    }
                    case GraphEditor.STATES.moveNode:
                    case GraphEditor.STATES.edit: {

                        this.#setClicked();
                        this.#setClicked({ node });
                        break;
                    }
                }
                break;
            }
            case SigmaEvents.clickEdge: {

                const { edge } = evt;
                switch (this.state) {
                    case GraphEditor.STATES.edit: {

                        this.#setClicked();
                        this.#setClicked({ edge })
                        break;
                    }
                    case GraphEditor.STATES.removeEdge: {
                        this.#graph.dropEdge(edge);
                        break;
                    }
                }
                break;
            }
        }
    }

    #setClicked({ node, edge } = {}) {
        this.#clicked = { node, edge };

        if (node) {
            this.#selected[this.#selected.has(node) ? 'delete' : 'add'](node);
        }

        if (!node && !edge) {
            this.#selected.clear();
        }
    }
}
