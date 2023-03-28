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
        this.possibleMoves = [];
        this.color = color;
    }


    /**
     * @param {[col, row]} piecePosition the current position (square) of the piece
     * @param {[T.Square]} squares the square position where to move the pawn
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(piecePosition, desiredSquare) {
    }

    /**
     * 
     * @param {T.Square} obs 
     * @returns {boolean} decide if there is opponent piece so we can't move further
     */
    checkObstacle(obs) {
        if (obs.piece) {
            if (obs.piece.color !== this.color) {
                this.possibleMoves.push(obs);
            }
            return true;
        }
        this.possibleMoves.push(obs)
        // we cannot move to a square occupied by our own piece
        return false;
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
                this.possibleMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 2))]);
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
                this.possibleMoves.push(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 2))]);
            }
        }
        // en passant stuff
        /**
         * @param {Pawn} piece
         * @param {T.Square} diag1 
         * @param {T.Square} diag2 
         */
        function checkEnemyDiagonal(piece, diag1, diag2) {
            if (diag1 && diag1.piece && diag1.piece.color !== piece.color) {
                piece.possibleMoves.push(diag1);
            }
            if (diag2 && diag2.piece && diag2.piece.color !== piece.color) {
                piece.possibleMoves.push(diag2);
            }
        }
        /**
         * 
         * @param {Pawn} piece 
         * @param {T.Square} front 
         */
        function checkEnemyFront(piece, front) {
            if (!front.piece) {
                piece.possibleMoves.push(front);
            }
        }
        return this.possibleMoves.filter((value) => value !== undefined);

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
        let possibleMoves = [];
        // knight can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
            if (knightPosition[1] < 8) {
                possibleMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < knightPosition[0] < 8) {
                    possibleMoves.push(squares[parseInt("" + (knightPosition[0] - 1) + (knightPosition[1] + 1))])
                    possibleMoves.push(squares[parseInt("" + (knightPosition[0] + 1) + (knightPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possibleMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] + 2))])
            }
        } else if (this.color === C.BLACK_PIECE) {
            if (knightPosition[1] > 0) {
                possibleMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] - 1))])
                if (0 < knightPosition[0] < 8) {
                    possibleMoves.push(squares[parseInt("" + (knightPosition[0] - 1) + (knightPosition[1] - 1))])
                    possibleMoves.push(squares[parseInt("" + (knightPosition[0] + 1) + (knightPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possibleMoves.push(squares[parseInt("" + knightPosition[0] + (knightPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possibleMoves;
    }
}

export class Bishop extends Piece {
    static value = 3;
    static type = C.BISHOP;

    constructor(color) {
        super(color);
    }

    /**
     * @param {[col, row]} bishopPosition the current position (square) of the bishop
     * @param {[T.Square]} squares the square position where to move the bishop
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(bishopPosition, squares) {
        this.possibleMoves = [];
        const [col, row] = bishopPosition;

        // up right squares
        for (let c = col + 1, r = row + 1; c <= 8 && r <= 8; c++, r++) {
            // there is opponent piece, we can't move further
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)])) {
                break;
            }
        }

        // up left squares 
        for (let c = col - 1, r = row + 1; c > 0 && r <= 8; c--, r++) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)])) {
                break;
            }
        }

        // down right squares 
        for (let c = col + 1, r = row - 1; c <= 8 && r > 0; c++, r--) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)])) {
                break;
            }
        }

        // down left squares 
        for (let c = col - 1, r = row - 1; c > 0 && r > 0; c--, r--) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)])) {
                break;
            }
        }
        return this.possibleMoves.filter((value) => value !== undefined);
    }
}

export class Rook extends Piece {
    static value = 5;
    static type = C.ROOK;

    constructor(color) {
        super(color);
    }


    /**
     * @param {[col, row]} rookPosition the current position (square) of the rook
     * @param {[T.Square]} squares the square position where to move the rook
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(rookPosition, squares) {
        this.possibleMoves = [];

        const [col, row] = rookPosition;
        // up squares
        for (let r = row + 1; r <= 8; r++) {
            if (this.checkObstacle(squares[parseInt(`${col}${r}`, 10)])) {
                break;
            }
        }
        // down squares
        for (let r = row - 1; r > 0; r--) {
            if (this.checkObstacle(squares[parseInt(`${col}${r}`, 10)])) {
                break;
            }
        }
        // left squares
        for (let c = col - 1; c > 0; c--) {
            if (this.checkObstacle(squares[parseInt(`${c}${row}`, 10)])) {
                break;
            }
        }
        // left squares
        for (let c = col + 1; c <= 8; c++) {
            if (this.checkObstacle(squares[parseInt(`${c}${row}`, 10)])) {
                break;
            }
        }

        return this.possibleMoves.filter((value) => value !== undefined);
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
        let possibleMoves = [];
        // queen can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
            if (queenPosition[1] < 8) {
                possibleMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < queenPosition[0] < 8) {
                    possibleMoves.push(squares[parseInt("" + (queenPosition[0] - 1) + (queenPosition[1] + 1))])
                    possibleMoves.push(squares[parseInt("" + (queenPosition[0] + 1) + (queenPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possibleMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] + 2))])
            }
        } else if (this.color === C.BLACK_PIECE) {
            if (queenPosition[1] > 0) {
                possibleMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] - 1))])
                if (0 < queenPosition[0] < 8) {
                    possibleMoves.push(squares[parseInt("" + (queenPosition[0] - 1) + (queenPosition[1] - 1))])
                    possibleMoves.push(squares[parseInt("" + (queenPosition[0] + 1) + (queenPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possibleMoves.push(squares[parseInt("" + queenPosition[0] + (queenPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possibleMoves;
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
        let possibleMoves = [];
        // king can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
            if (kingPosition[1] < 8) {
                possibleMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] + 1))])
                // can capture one square in diagonal
                if (0 < kingPosition[0] < 8) {
                    possibleMoves.push(squares[parseInt("" + (kingPosition[0] - 1) + (kingPosition[1] + 1))])
                    possibleMoves.push(squares[parseInt("" + (kingPosition[0] + 1) + (kingPosition[1] + 1))])
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true) {
                possibleMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] + 2))])
            }
        } else if (this.color === C.BLACK_PIECE) {
            if (kingPosition[1] > 0) {
                possibleMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] - 1))])
                if (0 < kingPosition[0] < 8) {
                    possibleMoves.push(squares[parseInt("" + (kingPosition[0] - 1) + (kingPosition[1] - 1))])
                    possibleMoves.push(squares[parseInt("" + (kingPosition[0] + 1) + (kingPosition[1] - 1))])
                }
            }
            if (this.hasMoved !== true) {
                possibleMoves.push(squares[parseInt("" + kingPosition[0] + (kingPosition[1] - 2))])
            }
        }
        // en passant stuff

        return possibleMoves;
    }
}