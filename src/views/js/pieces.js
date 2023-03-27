export class Piece {
    /** 
    * @type {Number} value the theroric value of the piece
    */
    static value;

    /**
     * 
     * @param {String} color black or white piece
     */
    constructor(color) {
        this.color = color;
    }


    /**
     * @param {[col, row]} piecePosition the current position (square) of the piece
     * @param {[square]} squares the square position where to move the pawn
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(piecePosition, desiredSquare) {
    }

}

export class Pawn extends Piece {
    static value = 1;

    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} pawnPosition the current position (square) of the pawn
     * @param {[square]} squares the square position where to move the pawn
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(pawnPosition, squares) {
        let possiblesMoves = [];
        // pawn can move 1 square ahead 
        if (this.color === 'w') {
            if (pawnPosition[1] < 8) {
                possiblesMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < pawnPosition[0] < 8) {
                    // check if there is enemy on the diagonal
                    
                    possiblesMoves.push(squares[parseInt("" + (pawnPosition[0] - 1) + (pawnPosition[1] + 1))])
                    possiblesMoves.push(squares[parseInt("" + (pawnPosition[0] + 1) + (pawnPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 2))])
            }
        } else if (this.color === 'b') {
            if (pawnPosition[1] > 0) {
                possiblesMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 1))])
                if (0 < pawnPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (pawnPosition[0] - 1) + (pawnPosition[1] - 1))])
                    possiblesMoves.push(squares[parseInt("" + (pawnPosition[0] + 1) + (pawnPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possiblesMoves.filter((value) => value !== undefined);
        
    }
}

export class Knight extends Piece {
    static value = 3;

    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} knightPosition the current position (square) of the knight
     * @param {[square]} squares the square position where to move the knight
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(knightPosition, squares) {
        let possiblesMoves = [];
        // knight can move 1 square ahead 
        if (this.color === 'w') {
            if (knightPosition[1] < 8) {
                possiblesMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < knightPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (knightPosition[0] - 1) + (knightPosition[1] + 1))])
                    possiblesMoves.push(squares[parseInt("" + (knightPosition[0] + 1) + (knightPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] + 2))])
            }
        } else if (this.color === 'b') {
            if (knightPosition[1] > 0) {
                possiblesMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] - 1))])
                if (0 < knightPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (knightPosition[0] - 1) + (knightPosition[1] - 1))])
                    possiblesMoves.push(squares[parseInt("" + (knightPosition[0] + 1) + (knightPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possiblesMoves;
    }
}

export class Bishop extends Piece {
    static value = 3;

    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} bishopPosition the current position (square) of the bishop
     * @param {[square]} squares the square position where to move the bishop
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(bishopPosition, squares) {
        let possiblesMoves = [];
        // bishop can move 1 square ahead 
        if (this.color === 'w') {
            if (bishopPosition[1] < 8) {
                possiblesMoves.push(squares[parseInt("" + bishopPosition[0] + (bishopPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < bishopPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (bishopPosition[0] - 1) + (bishopPosition[1] + 1))])
                    possiblesMoves.push(squares[parseInt("" + (bishopPosition[0] + 1) + (bishopPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + bishopPosition[0] + (bishopPosition[1] + 2))])
            }
        } else if (this.color === 'b') {
            if (bishopPosition[1] > 0) {
                possiblesMoves.push(squares[parseInt("" + bishopPosition[0] + (bishopPosition[1] - 1))])
                if (0 < bishopPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (bishopPosition[0] - 1) + (bishopPosition[1] - 1))])
                    possiblesMoves.push(squares[parseInt("" + (bishopPosition[0] + 1) + (bishopPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + bishopPosition[0] + (bishopPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possiblesMoves;
    }
}

export class Rook extends Piece {
    static value = 5;

    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} rookPosition the current position (square) of the rook
     * @param {[square]} squares the square position where to move the rook
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(rookPosition, squares) {
        let possiblesMoves = [];
        // rook can move 1 square ahead 
        if (this.color === 'w') {
            if (rookPosition[1] < 8) {
                possiblesMoves.push(squares[parseInt("" + rookPosition[0] + (rookPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < rookPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (rookPosition[0] - 1) + (rookPosition[1] + 1))])
                    possiblesMoves.push(squares[parseInt("" + (rookPosition[0] + 1) + (rookPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + rookPosition[0] + (rookPosition[1] + 2))])
            }
        } else if (this.color === 'b') {
            if (rookPosition[1] > 0) {
                possiblesMoves.push(squares[parseInt("" + rookPosition[0] + (rookPosition[1] - 1))])
                if (0 < rookPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (rookPosition[0] - 1) + (rookPosition[1] - 1))])
                    possiblesMoves.push(squares[parseInt("" + (rookPosition[0] + 1) + (rookPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + rookPosition[0] + (rookPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possiblesMoves;
    }
}

export class Queen extends Piece {
    static value = 9;

    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} queenPosition the current position (square) of the queen
     * @param {[square]} squares the square position where to move the queen
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(queenPosition, squares) {
        let possiblesMoves = [];
        // queen can move 1 square ahead 
        if (this.color === 'w') {
            if (queenPosition[1] < 8) {
                possiblesMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < queenPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (queenPosition[0] - 1) + (queenPosition[1] + 1))])
                    possiblesMoves.push(squares[parseInt("" + (queenPosition[0] + 1) + (queenPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] + 2))])
            }
        } else if (this.color === 'b') {
            if (queenPosition[1] > 0) {
                possiblesMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] - 1))])
                if (0 < queenPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (queenPosition[0] - 1) + (queenPosition[1] - 1))])
                    possiblesMoves.push(squares[parseInt("" + (queenPosition[0] + 1) + (queenPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possiblesMoves;
    }
}

export class King extends Piece {
    static value = 100;

    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} kingPosition the current position (square) of the king
     * @param {[square]} squares the square position where to move the king
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(kingPosition, squares) {
        let possiblesMoves = [];
        // king can move 1 square ahead 
        if (this.color === 'w') {
            if (kingPosition[1] < 8) {
                possiblesMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < kingPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (kingPosition[0] - 1) + (kingPosition[1] + 1))])
                    possiblesMoves.push(squares[parseInt("" + (kingPosition[0] + 1) + (kingPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] + 2))])
            }
        } else if (this.color === 'b') {
            if (kingPosition[1] > 0) {
                possiblesMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] - 1))])
                if (0 < kingPosition[0] < 8) {
                    possiblesMoves.push(squares[parseInt("" + (kingPosition[0] - 1) + (kingPosition[1] - 1))])
                    possiblesMoves.push(squares[parseInt("" + (kingPosition[0] + 1) + (kingPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possiblesMoves;
    }
}