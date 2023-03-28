import * as C from "./consts.js";
import * as Pieces from "./pieces.js";
import * as T from "./types.js";
// import { Piece } from "./types.js";

// get the chess board and pieces from the DOM

    // socket.io
const socket = io('ws://localhost:3000');
const play = document.getElementById("play-button");

const board = document.getElementById("board-single");
const gridOverlay = document.getElementById("grid-overlay");
const pieces = document.querySelectorAll(".piece");
const selectedPieceSquareColor = "rgba(165, 126, 53, 0.7)";
const previousSquareColor = "rgba(165, 126, 53, 0.5)";

// First player is white
let currentPlayer = C.WHITE_PIECE;

// Player's id
let myId= document.getElementById("my-id").value

// Oponent's id
let oponentId= ""

// color of the player
let currentIdColor=C.WHITE_PIECE;

// track the currently selected piece
/**
 * @type {T.Piece}
 */
let selectedPiece = null;
/**
 * @type {T.Square}
 */
let previousMovedSquare = null;
/**
 * @type {T.Square}
 */
let previousMovedPiece = null;

/**
 * @type {T.Square[]}
 */
let squares = (function () {
    // Get the dimensions of each cell in the grid
    let cellWidth = board.clientWidth / 8;
    let cellHeight = board.clientHeight / 8;
    /**
     * @type {T.Square[]}
     */
    let squares = []
    // Iterate through each cell in the grid
    for (let row = 8; row >= 1; row--) {
        for (let col = 1; col <= 8; col++) {
            let squareDiv = document.createElement("div");

            // Set the class and position of the div element
            squareDiv.className = "square";
            squareDiv.style.top = row * cellHeight + "px";
            squareDiv.style.left = col * cellWidth + "px";

            gridOverlay.appendChild(squareDiv);
            // Create an object to represent the current square
            /**
             * @type {T.Square}
             */
            let square = {
                col: col,
                row: row,
                width: cellWidth,
                height: cellHeight,
                div: squareDiv,
                piece: null,
            };
            squareDiv.addEventListener("click", (event) => {
                if (selectedPiece) {
                    // move the piece
                    selectedPiece = movePiece(selectedPiece, square);
                }
            });
            squares[parseInt("" + col + row)] = square;
        }
    }

    // TODO: Fix pawn not seeing last ranks ennemies

    // (function init() {
    //     const rows = [1, 2, 7, 8];
    //     rows.forEach(row => {
    //         for (let col = 1; col <= 8; col++) {
    //             // say that there is something on those squares

    //             squares[parseInt("" + row + col)].piece = new Pieces.Pawn(C.WHITE_PIECE);
    //         }
    //     });
    // })();
    return squares;
})();

// add event listener to play button
play.addEventListener("click", () => {
    oponentId= document.getElementById("oponent-id").value;
    if (oponentId!=""){
        initiateGame(oponentId);
    }
});

// add event listeners to each chess piece
pieces.forEach((piece) => {
    piece.addEventListener("click", () => {

        // set the starting position of the piece
        piece.style.position = "absolute";
        piece.style.left = "0";
        piece.style.top = "0";

        // hide the availabeles moves when another piece is selected 
        if (selectedPiece) {
            getAvailableMoves(selectedPiece, false);
        }
        if (selectedPiece && selectedPiece.element === piece) {
            piece.style.backgroundColor = "";
            selectedPiece = null;

        } else if (selectedPiece == null || selectedPiece.element !== piece) {
            // store the current position of the piece
            if (selectedPiece !== null && selectedPiece.element !== piece) {
                selectedPiece.element.style.backgroundColor = "";
            }
            selectedPiece = {
                element: piece,
                color: getPieceProperties(piece).color,
                type: getPieceProperties(piece).type,
                object: getPieceProperties(piece).pieceObject,
                position: getPieceProperties(piece).position,
            };
            piece.style.backgroundColor = selectedPieceSquareColor;
        }
        // console.log(selectedPiece.position);
        getAvailableMoves(selectedPiece);
    });
});

//Accepts a game started by an oponent
socket.on('gameStart', gameStart => {
    if (gameStart[1] == myId){
        socket.emit('gameAccepted', gameStart);
    }
    currentIdColor= C.BLACK_PIECE
});

//Starts a game accepted by an oponent
socket.on('gameAccepted', gameAccepted => {
    if (gameAccepted[0] == myId){
        socket.emit('gameAccepted', startGame(gameAccepted));
    }
    currentIdColor= C.WHITE_PIECE
});

/**
 * Initiates a new game against the specified oponent
 * @param {String} oponentId - The id of the oponent
 * @returns {void}
 */
function initiateGame(oponentId) {
    socket.emit('gameStart', [myId, oponentId]);
}


function startGame(oponentId) {
    socket.emit('gameStart', [myId, oponentId]);
}

/**
 *
 * @param {T.Piece} selectedPiece
 * @param {T.Square} squareToMove the square where to move the piece
 * @returns {T.Piece|null}
 */
function movePiece(selectedPiece, squareToMove) {
    // if it is not the turn of the right player he cannot move the piece
    if (currentPlayer !== selectedPiece.color) {
        return selectedPiece;
    }

    // reset the color of the previous move
    if (previousMovedSquare) {
        previousMovedSquare.style.backgroundColor = "";
    }
    if (previousMovedPiece) {
        previousMovedPiece.element.style.backgroundColor = "";
    }
    // the square where to move might be a valid one
    if (!getAvailableMoves(selectedPiece, false).includes(squareToMove)) {
        selectedPiece.element.style.backgroundColor = "";
        return null;
    }


    const piece = selectedPiece.element;
    const pieceClassName = piece.className;

    const squarePositionClassName = /square-\d+/;
    const squareNewPostionClassName = "square-" + squareToMove.col + squareToMove.row;
    const currentPosition = "" + selectedPiece.position.col + selectedPiece.position.row;

    // move the piece
    piece.className = piece.className.replace(
        squarePositionClassName,
        squareNewPostionClassName
    );
    // if (pieceClassName.match(squarePositionClassName) !== null) {
    // } else {
    //     throw Error("Not a valid piece or square");
    // }

    // we store this square move which will stay highlighted
    previousMovedSquare = squares[parseInt(currentPosition)].div;
    previousMovedSquare.style.backgroundColor = previousSquareColor;
    console.log(squares[parseInt(currentPosition)]);

    previousMovedPiece = selectedPiece;

    // after moving the piece we switch player turn
    currentPlayer = currentPlayer === C.WHITE_PIECE ? C.BLACK_PIECE : C.WHITE_PIECE;
    // let sq = squares[squares.indexOf(squareToMove)] ;

    // if it's a pawn make sure no to have the possibility to move up 2 squares
    squareToMove.piece = selectedPiece.object;

    if (selectedPiece.type === C.PAWN) {
        squareToMove.piece.hasMoved = true;
    }

    squares[squares.indexOf(squareToMove)] = squareToMove;

    // remove the selected piece from the squares.
    squares[squares.indexOf(selectedPiece.position)].piece = null;

    return null;
}

/**
 * Returns the color and the type of the selected piece
 * @param {Element} piece The html element representing the piece
 * @returns {{color:string, type:string, pieceObject: Pieces.Piece, position:Square}}
 */
function getPieceProperties(piece) {
    const properties = {};
    const pieceType = piece.className.match(/\b[w|b][a-z]\b/gi);

    properties.color = pieceType[0][0] == C.WHITE_PIECE ? C.WHITE_PIECE : C.BLACK_PIECE;
    properties.type = pieceType[0][1];

    properties.position = getPiecePositionSquare(piece);

    switch (properties.type) {
        case C.PAWN:
            properties.pieceObject = new Pieces.Pawn(properties.color);
            break;
        case C.KNIGHT:
            properties.pieceObject = new Pieces.Knight(properties.color);
            break;
        case C.BISHOP:
            properties.pieceObject = new Pieces.Bishop(properties.color);
            break;
        case C.ROOK:
            properties.pieceObject = new Pieces.Rook(properties.color);
            break;
        case C.QUEEN:
            properties.pieceObject = new Pieces.Queen(properties.color);
            break;
        case C.KING:
            properties.pieceObject = new Pieces.King(properties.color);
            break;
        default:
            throw Error("Undefined piece type !");
    }
    return properties;
}

/**
 * Return a square object that represent the position of the piece
 * @param {HTMLElement} piece
 * @returns {T.Square} A square object
 */
function getPiecePositionSquare(piece) {
    const squarePositionByClassName = /square-\d+/;
    const position = piece.className
        .match(squarePositionByClassName)[0]
        .substring(7);

    return squares[parseInt(position)];
}

/**
 *
 * @param {T.Piece} selectedPiece
 * @param {Boolean} toDisplay if false, hide the moves
 */
function getAvailableMoves(selectedPiece, toDisplay = true) {
    if (!selectedPiece) {
        return;
    }
    // console.log(selectedPiece)
    if (selectedPiece.color === currentPlayer && currentIdColor === selectedPiece.color) {
        const position = [selectedPiece.position.col, selectedPiece.position.row]
        /**
         * @type {T.Square[]}
         */
        let moves = [];
        if (selectedPiece.position.piece) {
            moves = selectedPiece.position.piece.getPossibleMoves(position, squares);
        } else {
            moves = selectedPiece.object.getPossibleMoves(position, squares);
        }
        moves.forEach((square) => {
            // square.div.style.borderColor = "red";
            if (!toDisplay) {
                square.div.style.backgroundColor = "";
                square.div.style.border = "none";

            } else {
                if (square.piece) {
                    square.div.style.backgroundColor = "rgba(225, 0, 0, 0.8)";
                    square.div.style.border = "5px solid red";

                } else
                    square.div.style.backgroundColor = "rgba(153, 164, 141, 0.3)";

            }
        });
        // console.log(moves);
        return moves;
    }

    return []
}

