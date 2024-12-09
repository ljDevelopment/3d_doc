import Piece from './piece.js';

export default class PieceElement extends HTMLElement {

    #piece
    #pieces
    #filter 
    #labels
    #tags
    #level

    constructor() {
        super();
        this.#pieces = [];
        this.#labels = [];
        this.#tags = [];
    }


    get piece() { return this.#piece; }
    set piece(value) { this.#piece = value; }
    setFilter({filter, tags, level, parentVisibleByLabel = false} = {}) {
        if (filter) {

            this.#filter = filter;
            this.#labels = filter.map(
                (node) => {
                    const {attributes} = node;
                    return attributes.label;
                }
            );
        }
        if (tags) {

            this.#tags = tags;
        }

        if (undefined !== level) {
            this.#level = level;
        }
        return this.#updateView(parentVisibleByLabel);
        
    }
    #updateView(parentVisibleByLabel) {

        const {info} = this.piece;
        const thisVisibleByLabel = (this.#labels.length == 0) || this.#labels.includes(info);

        const {tags} = this.piece;
        const thisVisibleByTag = (this.#tags.length == 0 || tags.reduce((prev, curr) => { return prev || this.#tags.includes(curr);}, false));

        const {level} = this.piece;
        const thisVisibleByLevel = this.#level >= level;

        const selfVisible = (thisVisibleByLabel && thisVisibleByTag);
        
        const anyChildVisible = this.#pieces.reduce(
            (prev, curr) => {
                const v =  curr.setFilter(
                    {
                        filter : this.#filter, 
                        tags : this.#tags, 
                        level : this.#level, 
                        parentVisibleByLabel : parentVisibleByLabel || (this.#labels.length > 0 && thisVisibleByLabel) || (this.#tags.length > 0 && thisVisibleByTag)
                    });
                return prev || v;
            }, false
        ) || false;

        const visible = anyChildVisible || (thisVisibleByLevel && (selfVisible || parentVisibleByLabel))
        this.style.display = visible ? 'unset' : 'none';
        console.log(this.piece.info, this.style.display, this.piece, {parentVisible: parentVisibleByLabel, anyChildVisible, thisVisibleByLabel, thisVisibleByTag, thisVisibleByLevel, selfVisible, visible});
        
        return visible || anyChildVisible;
    }

    connectedCallback() {
        this.#render();
        console.log(this, this.piece);
    }

    disconnectedCallback() {
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {
    }

    #render() {
        this.innerHTML = '';
        if (!this.piece) { return; }

        let element = null;
        switch (this.piece.type) {
            case Piece.TYPES.PIECE: {
                element = document.createElement(`h${this.piece.depth + 1}`);
                element.textContent = this.piece.info;
                this.appendChild(element);
                this.piece.pieces.forEach((p) => {
                    
                    const pieceElement = document.createElement('piece-element');
                    pieceElement.piece = p;
                    this.appendChild(pieceElement);
                    this.#pieces.push(pieceElement);
                });
                break;
            }
            case Piece.TYPES.PARAGRAPH: {
                element = document.createElement('p');
                element.textContent = this.piece.info;
                this.appendChild(element);
                break;
            }
            case Piece.TYPES.LIST:
            case Piece.TYPES.OLIST: {

                element = document.createElement(this.piece.type == Piece.TYPES.OLIST ? 'ol' : 'ul');
                this.piece.info.forEach(
                    (i) => {
                        const li = document.createElement('li');
                        li.textContent = i;
                        element.appendChild(li);
                    }
                );
                this.appendChild(element);
                break;
            }
            case Piece.TYPES.IMAGE: {
                element = document.createElement('img');
                element.setAttribute('src', this.piece.info);
                this.appendChild(element);

                break;
            }
        }

        element.setAttribute('data-level', this.piece.level);
        if (this.piece.tags.length) {
            element.setAttribute('data-tags', this.piece.tags.join(','));
        }
    }
    
}

customElements.define('piece-element', PieceElement);
