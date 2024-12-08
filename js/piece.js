export default class Piece {

    static TYPES = {
        PIECE: 'piece',
        PARAGRAPH: 'paragraph',
        LIST: 'list',
        OLIST: 'olist',
        IMAGE: 'image',
    };

    static parse({ info, pieces = [], type, tags = [], level = 0 } = [], parent = null) {

        const parsedType = type ? type : (pieces && pieces.length > 0)
            ? Piece.TYPES.PIECE
            : (Array.isArray(info))
                ? Piece.TYPES.LIST
                : Piece.TYPES.PARAGRAPH;

        const piece = new Piece({info, type :  parsedType, tags, level, parent });
        const parsedPieces = pieces.map(p => Piece.parse(p, piece));
        piece.add(parsedPieces);
        return piece;
    }

    #type
    #info
    #tags
    #level
    #pieces
    #parent
    #depth

    constructor({ info = null, type = Piece.TYPES.PIECE, level = 0, tags = [], parent = null } = {}) {

        this.#info = info;
        this.#pieces = [];
        this.#type = type;
        this.#tags = tags;
        this.#level = level;
        this.#parent = parent;
        this.#depth = parent ? parent.depth + 1 : 0;
    }

    add(pieces) {
        this.pieces.push(...pieces);
    }

    get type() { return this.#type; }
    get info() { return this.#info; }
    get tags() { return this.#tags; }
    get level() { return this.#level; }
    get pieces() { return this.#pieces; }
    get parent() { return this.#parent; }
    get depth() { return this.#depth; }
}


export function printPiece(piece, parent) {


    let element = null;
    switch (piece.type) {
        case Piece.TYPES.PIECE: {
            element = document.createElement(`h${piece.level + 1}`);
            element.textContent = piece.info;
            parent.appendChild(element);
            piece.pieces.forEach(p => printPiece(p, parent));
            break;
        }
        case Piece.TYPES.PARAGRAPH: {
            element = document.createElement('p');
            element.textContent = piece.info;
            parent.appendChild(element);
            break;
        }
        case Piece.TYPES.LIST:
        case Piece.TYPES.OLIST: {

            element = document.createElement(piece.type == Piece.TYPES.OLIST ? 'ol' : 'ul');
            piece.info.forEach(
                (i) => {
                    const li = document.createElement('li');
                    li.textContent = i;
                    element.appendChild(li);
                }
            );
            parent.appendChild(element);
            break;
        }
        case Piece.TYPES.IMAGE: {
            element = document.createElement('img');
            element.setAttribute('src', piece.info);
            parent.appendChild(element);

            break;
        }
    }

    if (piece.tags.length) {
        element.setAttribute('data-tags', piece.tags.join(','));
    }
}