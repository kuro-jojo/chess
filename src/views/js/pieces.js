import * as C from "./consts.js";
import * as T from "./types.js";

export class Piece {
    /** 
    * @type {Number} value the theroric value of the piece
    */
    static value;
    
    /**
     * @type {string}
     */
    static type;

    /**
     * 
     * @param {String} color black or white piece
     */
    constructor(color) {
        this.color = color;
    }


    /**
     * @param {[col, row]} piecePosition the current position (square) of the piece
     * @param {[T.Square]} squares the square position where to move the pawn
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(piecePosition, desiredSquare) {
    }

}

export class Pawn extends Piece {
    static value = 1;

    static type = C.PAWN;
    constructor(color) {
        super(color);
        this.hasMoved = false;
    }

    /**
     * @param {[col, row]} pawnPosition the current position (square) of the pawn
     * @param {[T.Square]} squares the square position where to move the pawn
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(pawnPosition, squares) {
        let possiblesMoves = [];
        // pawn can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
            if (pawnPosition[1] < 8) {
                checkEnemyFront(this, squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 1))]);
                // can capture one square in diagonal
                if (0 < pawnPosition[0] < 8) {
                    // check if there is enemy on the diagonal
                    const diag1 = squares[parseInt("" + (pawnPosition[0] - 1) + (pawnPosition[1] + 1))];
                    const diag2 = squares[parseInt("" + (pawnPosition[0] + 1) + (pawnPosition[1] + 1))];
                    
                    // console.log(diag1, diag2)
                    checkEnemyDiagonal(this, diag1, diag2);
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possiblesMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 2))]);
            }
        } else if (this.color === C.BLACK_PIECE) {
            if (pawnPosition[1] > 0) {
                checkEnemyFront(this, squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 1))]);
                if (0 < pawnPosition[0] < 8) {
                    const diag1 = squares[parseInt("" + (pawnPosition[0] - 1) + (pawnPosition[1] - 1))];
                    const diag2 = squares[parseInt("" + (pawnPosition[0] + 1) + (pawnPosition[1] - 1))];

                    checkEnemyDiagonal(this, diag1, diag2);
                }
            }
            if (!this.hasMoved) {
                possiblesMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 2))]);
            }
        }
        // en passant stuff
        /**
         * 
         * @param {T.Square} diag1 
         * @param {T.Square} diag2 
         */
        function checkEnemyDiagonal(piece, diag1, diag2) {
            if (diag1.piece && diag1.piece.color !== piece.color) {
                possiblesMoves.push(diag1);
            }
            if (diag2.piece && diag2.piece.color !== piece.color) {
                possiblesMoves.push(diag2);
            }
        }

        function checkEnemyFront(piece, front) {
            if (!front.piece) {
                possiblesMoves.push(front);
            }
        }
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
     * @param {[T.Square]} squares the square position where to move the knight
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(knightPosition, squares) {
        let possiblesMoves = [];
        // knight can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
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
        } else if (this.color === C.BLACK_PIECE) {
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
     * @param {[T.Square]} squares the square position where to move the bishop
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(bishopPosition, squares) {
        let possiblesMoves = [];
        // bishop can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
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
        } else if (this.color === C.BLACK_PIECE) {
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
     * @param {[T.Square]} squares the square position where to move the rook
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(rookPosition, squares) {
        let possiblesMoves = [];
        // rook can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
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
        } else if (this.color === C.BLACK_PIECE) {
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
     * @param {[T.Square]} squares the square position where to move the queen
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(queenPosition, squares) {
        let possiblesMoves = [];
        // queen can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
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
        } else if (this.color === C.BLACK_PIECE) {
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
     * @param {[T.Square]} squares the square position where to move the king
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(kingPosition, squares) {
        let possiblesMoves = [];
        // king can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
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
        } else if (this.color === C.BLACK_PIECE) {
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