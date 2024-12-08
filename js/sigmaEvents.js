export default class SigmaEvents {

    static enterNode = 'enterNode';
    static leaveNode = 'leaveNode';
    static downNode = 'downNode';
    static clickNode = 'clickNode';
    static rightClickNode = 'rightClickNode';
    static doubleClickNode = 'doubleClickNode';
    static wheelNode = 'wheelNode';

    static enterEdge = 'enterEdge';
    static leaveEdge = 'leaveEdge';
    static downEdge = 'downEdge';
    static clickEdge = 'clickEdge';
    static rightClickEdge = 'rightClickEdge';
    static doubleClickEdge = 'doubleClickEdge';
    static wheelEdge = 'wheelEdge';

    static downStage = 'downStage';
    static clickStage = 'clickStage';
    static doubleClickStage = 'doubleClickStage';
    static wheelStage = 'wheelStage';

    static NODE_EVENTS = [SigmaEvents.enterNode, SigmaEvents.leaveNode, SigmaEvents.downNode, SigmaEvents.clickNode, SigmaEvents.rightClickNode, SigmaEvents.doubleClickNode, SigmaEvents.wheelNode];
    static EDGE_EVENTS = [SigmaEvents.enterEdge, SigmaEvents.leaveEdge, SigmaEvents.downEdge, SigmaEvents.clickEdge, SigmaEvents.rightClickEdge, SigmaEvents.doubleClickEdge, SigmaEvents.wheelEdge];
    static STAGE_EVENTS = [SigmaEvents.downStage, SigmaEvents.clickStage, SigmaEvents.doubleClickStage, SigmaEvents.wheelStage];

    #sigma
    #currentEdge
    #currentNode
    #edgeReducer
    #nodeReducer

    constructor(sigma) {

        this.#sigma = sigma;

        [SigmaEvents.enterEdge, SigmaEvents.leaveEdge, SigmaEvents.enterNode, SigmaEvents.leaveNode].forEach(
            (eventType) => {
                this.#sigma.on(eventType, (evt) => {
                    switch (eventType) {
                        case SigmaEvents.enterEdge:
                            this.#currentEdge = evt.edge;
                            break;
                        case SigmaEvents.leaveEdge:
                            this.#currentEdge = null;
                            break;
                        case SigmaEvents.enterNode:
                            this.#currentNode = evt.node;
                            break;
                        case SigmaEvents.leaveNode:
                            this.#currentNode = null;
                            break;
                    }
                    this.#sigma.refresh();
                })
            });
    }

    get sigma() { return this.#sigma; }
    get currentEdge() { return this.#currentEdge; }
    get currentNode() { return this.#currentNode; }
    set edgeReducer(reducer) {
        if (!this.#edgeReducer) {
            this.addListener(SigmaEvents.enterEdge, () => { });
            this.addListener(SigmaEvents.leaveEdge, () => { });
        }
        this.#edgeReducer = reducer;
        this.#sigma.setSetting('edgeReducer', (edge, data) => {
            if (!this.#edgeReducer) { return; }
            return this.#edgeReducer(this, edge, data);
        });
    }
    set nodeReducer(reducer) {
        this.#nodeReducer = reducer;
        this.#sigma.setSetting('nodeReducer', (edge, data) => {
            if (!this.#nodeReducer) { return; }
            return this.#nodeReducer(this, edge, data);
        });
    }

    addListener(eventType, callback) {

        switch (eventType) {
            case SigmaEvents.clickEdge:
            case SigmaEvents.downEdge:
            case SigmaEvents.rightClickEdge:
            case SigmaEvents.doubleClickEdge:
                this.#sigma.setSetting('enableEdgeClickEvents', true);
                break;
            case SigmaEvents.enterEdge:
            case SigmaEvents.leaveEdge:
                this.#sigma.setSetting('enableEdgeHoverEvents', true);
                break;
            case SigmaEvents.wheelEdge:
                this.#sigma.setSetting('enableEdgeWheelEvents', true);
                break;
        }
        this.#sigma.on(eventType, (evt) => {
            callback(this, eventType, evt);
        });
    }
}

