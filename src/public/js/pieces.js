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
    constructor(color, hasMoved = false) {
        // possibleMoves = [];
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
     * Add a new move it is possible
     * @param {T.Square} obs 
     * @param {[]} possibleMoves
     * @returns {boolean} decide if there is opponent piece so we can't move further
     */
    checkObstacle(obs, possibleMoves) {
        if (obs.piece) {
            if (obs.piece.color !== this.color) {
                possibleMoves.push(obs);
            }
            return true;
        }
        possibleMoves.push(obs)

        // we cannot move to a square occupied by our own piece
        return false;
    }
}

export class Pawn extends Piece {
    static value = 1;

    static type = C.PAWN;
    constructor(color, hasMoved = false) {
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
        let possibleMoves = [];
        let canMoveTwoSquares = false;
        // pawn can move 1 square ahead 
        if (this.color === C.WHITE_PIECE) {
            if (pawnPosition[1] < 8) {
                if (checkEnemyFront(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 1))], possibleMoves)) {
                    canMoveTwoSquares = true;
                };
                // can capture one square in diagonal
                if (0 < pawnPosition[0] < 8) {
                    // check if there is enemy on the diagonal
                    const diag1 = squares[parseInt("" + (pawnPosition[0] - 1) + (pawnPosition[1] + 1))];
                    const diag2 = squares[parseInt("" + (pawnPosition[0] + 1) + (pawnPosition[1] + 1))];

                    checkEnemyDiagonal(this, diag1, diag2, possibleMoves);
                }
            }
            // but can move 2 if it's the first time is moving
            if (this.hasMoved !== true && canMoveTwoSquares) {
                checkEnemyFront(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] + 2))], possibleMoves);

            }
        } else if (this.color === C.BLACK_PIECE) {
            if (pawnPosition[1] > 0) {
                if (checkEnemyFront(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 1))], possibleMoves)) {
                    canMoveTwoSquares = true;
                };
                if (0 < pawnPosition[0] < 8) {
                    const diag1 = squares[parseInt("" + (pawnPosition[0] - 1) + (pawnPosition[1] - 1))];
                    const diag2 = squares[parseInt("" + (pawnPosition[0] + 1) + (pawnPosition[1] - 1))];

                    checkEnemyDiagonal(this, diag1, diag2, possibleMoves);
                }
            }
            if (!this.hasMoved && canMoveTwoSquares) {
                checkEnemyFront(squares[parseInt("" + pawnPosition[0] + (pawnPosition[1] - 2))], possibleMoves);
            }
        }
        /**
         * @param {Pawn} piece
         * @param {T.Square} diag1 
         * @param {T.Square} diag2 
         * @param {[]} possibleMoves
         */
        function checkEnemyDiagonal(piece, diag1, diag2, possibleMoves) {
            if (diag1 && diag1.piece && diag1.piece.color !== piece.color) {
                possibleMoves.push(diag1);
            }
            if (diag2 && diag2.piece && diag2.piece.color !== piece.color) {
                possibleMoves.push(diag2);
            }
        }
        /**
         * 
         * @param {T.Square} front 
         * @param {[]} possibleMoves
         */
        function checkEnemyFront(front, possibleMoves) {
            if (front.piece === null) {
                possibleMoves.push(front);
                return true;
            }
            return false;
        }
        return possibleMoves.filter((value) => value !== undefined);
    }
}

export class Knight extends Piece {
    static value = 3;
    static type = C.KNIGHT;

    constructor(color, hasMoved = false) {
        super(color);
    }

    /**
     * @param {[col, row]} knightPosition the current position (square) of the knight
     * @param {[T.Square]} squares the square position where to move the knight
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(knightPosition, squares) {
        let possibleMoves = [];
        // 8 possible moves for a knight: 2 up/down and 1 left/right, or 2 left/right and 1 up/down
        const moves = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]];
        const [col, row] = knightPosition;

        for (let move of moves) {
            const c = col + move[0];
            const r = row + move[1];

            // check if the move is within the board bounds
            if (c < 1 || c > 8 || r < 1 || r > 8) {
                continue;
            }
            this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves);
        }
        return possibleMoves.filter((value) => value !== undefined);
    }
}

export class Bishop extends Piece {
    static value = 3;
    static type = C.BISHOP;

    constructor(color, hasMoved = false) {
        super(color);
    }

    /**
     * @param {[col, row]} bishopPosition the current position (square) of the bishop
     * @param {[T.Square]} squares the square position where to move the bishop
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(bishopPosition, squares) {
        let possibleMoves = [];
        const [col, row] = bishopPosition;

        // up right squares
        for (let c = col + 1, r = row + 1; c <= 8 && r <= 8; c++, r++) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // up left squares 
        for (let c = col - 1, r = row + 1; c > 0 && r <= 8; c--, r++) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // down right squares 
        for (let c = col + 1, r = row - 1; c <= 8 && r > 0; c++, r--) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // down left squares 
        for (let c = col - 1, r = row - 1; c > 0 && r > 0; c--, r--) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }
        return possibleMoves.filter((value) => value !== undefined);
    }
}

export class Rook extends Piece {
    static value = 5;
    static type = C.ROOK;

    constructor(color, hasMoved = false) {
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
        let possibleMoves = [];

        const [col, row] = rookPosition;
        // up squares
        for (let r = row + 1; r <= 8; r++) {
            if (this.checkObstacle(squares[parseInt(`${col}${r}`, 10)], possibleMoves)) {
                break;
            }
        }
        // down squares
        for (let r = row - 1; r > 0; r--) {
            if (this.checkObstacle(squares[parseInt(`${col}${r}`, 10)], possibleMoves)) {
                break;
            }
        }
        // left squares
        for (let c = col - 1; c > 0; c--) {
            if (this.checkObstacle(squares[parseInt(`${c}${row}`, 10)], possibleMoves)) {
                break;
            }
        }
        // left squares
        for (let c = col + 1; c <= 8; c++) {
            if (this.checkObstacle(squares[parseInt(`${c}${row}`, 10)], possibleMoves)) {
                break;
            }
        }

        return possibleMoves.filter((value) => value !== undefined);
    }
}

export class Queen extends Piece {
    static value = 9;
    static type = C.QUEEN;

    constructor(color, hasMoved = false) {
        super(color);
    }

    /**
     * Combination between bishop and rook moves
     * @param {[col, row]} queenPosition the current position (square) of the queen
     * @param {[T.Square]} squares the square position where to move the queen
     * 
     * @returns {[]} list of possible moves
     */
    getPossibleMoves(queenPosition, squares) {
        let possibleMoves = [];
        const [col, row] = queenPosition;

        // up right squares
        for (let c = col + 1, r = row + 1; c <= 8 && r <= 8; c++, r++) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // up left squares 
        for (let c = col - 1, r = row + 1; c > 0 && r <= 8; c--, r++) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // down right squares 
        for (let c = col + 1, r = row - 1; c <= 8 && r > 0; c++, r--) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // down left squares 
        for (let c = col - 1, r = row - 1; c > 0 && r > 0; c--, r--) {
            if (this.checkObstacle(squares[parseInt(`${c}${r}`, 10)], possibleMoves)) {
                break;
            }
        }

        // up squares
        for (let r = row + 1; r <= 8; r++) {
            if (this.checkObstacle(squares[parseInt(`${col}${r}`, 10)], possibleMoves)) {
                break;
            }
        }
        // down squares
        for (let r = row - 1; r > 0; r--) {
            if (this.checkObstacle(squares[parseInt(`${col}${r}`, 10)], possibleMoves)) {
                break;
            }
        }
        // left squares
        for (let c = col - 1; c > 0; c--) {
            if (this.checkObstacle(squares[parseInt(`${c}${row}`, 10)], possibleMoves)) {
                break;
            }
        }
        // left squares
        for (let c = col + 1; c <= 8; c++) {
            if (this.checkObstacle(squares[parseInt(`${c}${row}`, 10)], possibleMoves)) {
                break;
            }
        }

        return possibleMoves.filter((value) => value !== undefined);
    }
}

export class King extends Piece {
    static value = 100;
    static type = C.KING;

    constructor(color, hasMoved = false) {
        super(color);
        this.isInCheck = false;
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

        const [col, row] = kingPosition;
        // up square
        if (row < 8) {
            this.checkObstacle(squares[parseInt(`${col}${row + 1}`, 10)], possibleMoves);
            // up left square
            if (col > 1) {
                this.checkObstacle(squares[parseInt(`${col - 1}${row + 1}`, 10)], possibleMoves);
            }
            // up right square
            if (col < 8) {
                this.checkObstacle(squares[parseInt(`${col + 1}${row + 1}`, 10)], possibleMoves);
            }
        }

        // down square
        if (row > 1) {
            this.checkObstacle(squares[parseInt(`${col}${row - 1}`, 10)], possibleMoves);
            // down left square
            if (col > 1) {
                this.checkObstacle(squares[parseInt(`${col - 1}${row - 1}`, 10)], possibleMoves);
            }
            // down right square
            if (col < 8) {
                this.checkObstacle(squares[parseInt(`${col + 1}${row - 1}`, 10)], possibleMoves);
            }
        }

        // left square
        if (col > 1) {

            this.checkObstacle(squares[parseInt(`${col - 1}${row}`, 10)], possibleMoves);
        }
        // right square
        if (col < 8) {
            this.checkObstacle(squares[parseInt(`${col + 1}${row}`, 10)], possibleMoves);
        }

        // castling
        if (!this.hasMoved && !this.isInCheck) {
            // rooks position based on the king position
            const rookPositions = [
                squares[parseInt(`${1}${row}`, 10)],
                squares[parseInt(`${8}${row}`, 10)],
            ];
            // short castle
            if (rookPositions[1].piece !== null && rookPositions[1].piece.constructor.type === C.ROOK && !rookPositions[1].hasMoved) {
                // check if the king can move to 2 squares to the right 
                if (!this.checkObstacle(squares[parseInt(`${col + 1}${row}`, 10)], possibleMoves)) {
                    this.checkObstacle(squares[parseInt(`${col + 2}${row}`, 10)], possibleMoves);
                }
            }
            // long castle
            if (rookPositions[0].piece !== null && rookPositions[0].piece.constructor.type === C.ROOK && !rookPositions[0].hasMoved) {
                // check if the king can move to 3 squares to the left and if the rook is still in place and has not moved
                if (!this.checkObstacle(squares[parseInt(`${col - 1}${row}`, 10)], possibleMoves)) {
                    this.checkObstacle(squares[parseInt(`${col - 2}${row}`, 10)], possibleMoves);
                }
            }
        }

        return [... new Set(possibleMoves.filter((value) => value !== undefined))];
    }



}