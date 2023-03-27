import * as Pieces from "./pieces.js";

// get the chess board and pieces from the DOM
const board = document.getElementById("board-single");
const gridOverlay = document.getElementById("grid-overlay");
const pieces = document.querySelectorAll(".piece");
const selectedPieceSquareColor = "rgba(165, 126, 53, 0.7)";
const previousSquareColor = "rgba(165, 126, 53, 0.5)";

const WHITE_PIECE = "w";
const BLACK_PIECE = "b";
let currentPlayer = WHITE_PIECE;

// track the currently selected piece
/**
 * @type {Piece}
 */
let selectedPiece = null;
/**
 * @type {Square}
 */
let previousMovedSquare = null;
/**
 * @type {Square}
 */
let previousMovedPiece = null;

/**
 * @type {Square[]}
 */
let squares = (function () {
    // Get the dimensions of each cell in the grid
    let cellWidth = board.clientWidth / 8;
    let cellHeight = board.clientHeight / 8;
    let squares = [];
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
             * @type {Square}
             */
            let square = {
                col: col,
                row: row,
                width: cellWidth,
                height: cellHeight,
                div: squareDiv,
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
    return squares;
})();

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
        getAvailableMoves(selectedPiece);
    });
});

/**
 *
 * @param {Piece} selectedPiece
 * @param {Square} squareToMove the square where to move the piece
 * @returns {Piece|null} 
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
        console.log(selectedPiece);
        return null;
    }


    const piece = selectedPiece.element;
    const pieceClassName = piece.className;

    // Change the piece square's
    const squarePositionClassName = /square-\d+/;
    const squareNewPostionClassName = "square-" + squareToMove.col + squareToMove.row;
    const cuurentPosition = "" + selectedPiece.position.col + selectedPiece.position.row;

    piece.className = piece.className.replace(
        squarePositionClassName,
        squareNewPostionClassName
    );
    // if (pieceClassName.match(squarePositionClassName) !== null) {
    // } else {
    //     throw Error("Not a valid piece or square");
    // }

    // we store this square move which will stay highlighted
    previousMovedSquare = squares[parseInt(cuurentPosition)].div;
    previousMovedSquare.style.backgroundColor = previousSquareColor;

    previousMovedPiece = selectedPiece;

    // after moving the piece we switch player turn
    currentPlayer = currentPlayer === WHITE_PIECE ? BLACK_PIECE : WHITE_PIECE;

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

    properties.color = pieceType[0][0] == WHITE_PIECE ? WHITE_PIECE : BLACK_PIECE;
    properties.type = pieceType[0][1];

    properties.position = getPiecePositionSquare(piece);

    switch (properties.type) {
        case "p":
            properties.pieceObject = new Pieces.Pawn(properties.color);
            break;
        case "n":
            properties.pieceObject = new Pieces.Knight(properties.color);
            break;
        case "b":
            properties.pieceObject = new Pieces.Bishop(properties.color);
            break;
        case "r":
            properties.pieceObject = new Pieces.Rook(properties.color);
            break;
        case "q":
            properties.pieceObject = new Pieces.Queen(properties.color);
            break;
        case "k":
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
 * @returns {Square} A square object
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
 * @param {Piece} selectedPiece
 * @param {Boolean} toDisplay if false, hide the moves
 */
function getAvailableMoves(selectedPiece, toDisplay = true) {
    if (!selectedPiece) {
        return;
    }
    console.log('heeerrrrrre')
    if (selectedPiece.color === currentPlayer) {
        const position = [selectedPiece.position.col, selectedPiece.position.row]
        /**
         * @type {Square[]}
         */
        const moves = selectedPiece.object.getPossibleMoves(position, squares);
        console.log(moves);
        moves.forEach((square) => {
            // square.div.style.borderColor = "red";
            if (!toDisplay) {
                square.div.style.backgroundColor = "";
            } else {
                square.div.style.backgroundColor = "rgba(153, 164, 141, 0.3)";
            }
        });
        return moves;
    }

    return []
}