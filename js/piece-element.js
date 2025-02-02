import Piece from './piece.js';

export default class PieceElement extends HTMLElement {

    #piece
    #pieces
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
    setFilter({labels, tags, level, parentVisibleByLabel = false} = {}) {
        if (undefined !== labels) { this.#labels = labels; }
        if (undefined !== tags) { this.#tags = tags; }
        if (undefined !== level) { this.#level = level; }
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
                        labels : this.#labels, 
                        tags : this.#tags, 
                        level : this.#level, 
                        parentVisibleByLabel : parentVisibleByLabel || (this.#labels.length > 0 && thisVisibleByLabel) || (this.#tags.length > 0 && thisVisibleByTag)
                    });
                return prev || v;
            }, false
        ) || false;

        const visible = anyChildVisible || (thisVisibleByLevel && (selfVisible || parentVisibleByLabel));
        const visibilityTarget = (this.parentElement.tagName == 'LI') ? this.parentElement : this;
        visibilityTarget.classList[visible ? 'remove' : 'add']('d-none');
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

        this.#renderPiece(this.piece, this);

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

                const listElement = document.createElement(this.piece.type == Piece.TYPES.OLIST ? 'ol' : 'ul');
                if (this.piece.info) {

                    element = document.createElement('p');
                    element.textContent = this.piece.info;
                    element.appendChild(listElement);
                } else {

                    element = listElement;
                }
                this.appendChild(element);

                this.piece.pieces.forEach(
                    (p) => {
                        const li = document.createElement('li');
                        listElement.appendChild(li);

                        const pieceElement = document.createElement('piece-element');
                        pieceElement.piece = p;
                        li.appendChild(pieceElement);
                        this.#pieces.push(pieceElement);
                    }
                );
                break;
            }
            case Piece.TYPES.IMAGE: {
                element = document.createElement('img');
                element.setAttribute('src', this.piece.info);
                this.appendChild(element);

                break;
            }
        }

        if (this.piece.tags.length) {
            element.setAttribute('data-tags', this.piece.tags.join(','));
        }
    }


    #renderPiece(piece, parent, leve = 0) {

    }
    
}

customElements.define('piece-element', PieceElement);
