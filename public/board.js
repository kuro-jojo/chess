// get the chess board and pieces from the DOM
const board = document.getElementById("board-single");
const gridOverlay = document.getElementById("grid-overlay");
const pieces = document.querySelectorAll(".piece");
const selectedPieceSquareColor = "rgba(165, 126, 53, 0.7)";
const previousSquareColor = "rgba(165, 126, 53, 0.5)";
// const boardRect = board.getBoundingClientRect();

const WHITE_PIECE = 'w';
const BLACK_PIECE = 'b';
let currentPlayer = WHITE_PIECE;

// track the currently selected piece
let selectedPiece = null;
let previousMovedSquare = null;
let previousMovedPiece = null;

// add event listeners to each chess piece
pieces.forEach((piece) => {
    piece.addEventListener("click", () => {
        rect = piece.getBoundingClientRect();

        // set the starting position of the piece
        piece.style.position = "absolute";
        piece.style.left = "0";
        piece.style.top = "0";

        if (selectedPiece) {
            if (selectedPiece.element === piece) {
                piece.style.backgroundColor = "";
                // piece.style.left = selectedPiece.initialX;
                // piece.style.top = selectedPiece.initialY;
                selectedPiece = null;

            } else {
                selectedPiece.element.style.backgroundColor = "";
                selectedPiece = {
                    element: piece,
                    color: getPieceColor(piece),
                    // x: rect['x'] - boardRect.left,
                    // y: rect['y'] - boardRect.top,
                    // initialX: selectedPiece.initialX,
                    // initialY: selectedPiece.initialY,
                };
                piece.style.backgroundColor = selectedPieceSquareColor;
            }
        }
        else if (selectedPiece == null) {
            /**
             * @type {element : string}
             */
            // store the current position of the piece

            selectedPiece = {
                element: piece,
                color: getPieceColor(piece),
                // x: rect['x'] - boardRect.left,
                // y: rect['y'] - boardRect.top,
                // initialX: rect['x'] - boardRect.left,
                // initialY: rect['y'] - boardRect.top,
            };
            piece.style.backgroundColor = selectedPieceSquareColor;
        }
    });
});

let squares = (function () {

    // Get the dimensions of each cell in the grid
    let cellWidth = board.clientWidth / 8;
    let cellHeight = board.clientHeight / 8;
    let squares = [];
    // Iterate through each cell in the grid
    for (let row = 8; row >= 1; row--) {
        for (let col = 1; col <= 8; col++) {

            let squareDiv = document.createElement('div');

            // Set the class and position of the div element
            squareDiv.className = 'square';
            squareDiv.style.top = row * cellHeight + 'px';
            squareDiv.style.left = col * cellWidth + 'px';

            gridOverlay.appendChild(squareDiv);
            // Create an object to represent the current square
            let square = {
                col: col,
                row: row,
                // x: col * cellWidth,
                // y: row * cellHeight,
                width: cellWidth,
                height: cellHeight,
                div: squareDiv,
            };
            squareDiv.addEventListener('click', event => {
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


function movePiece(selectedPiece, square) {

    // if it is not the turn of the right player he cannot move the piece
    if (currentPlayer !== selectedPiece.color) {
        return selectedPiece;
    }

    // reset the color of the previous move 
    if (previousMovedSquare) {
        previousMovedSquare.style.backgroundColor = ""
    }
    if (previousMovedPiece) {
        previousMovedPiece.element.style.backgroundColor = ""
    }

    const piece = selectedPiece.element;
    const pieceClassName = piece.className;

    // Change the piece square's
    const squarePositionByClassName = /square-\d+/;
    const squareNewPostionByClassName = 'square-' + square.col + square.row;
    const position = pieceClassName.match(squarePositionByClassName)[0].substring(7);


    if (pieceClassName.match(squarePositionByClassName) !== null) {
        piece.className = piece.className.replace(squarePositionByClassName, squareNewPostionByClassName);
    } else {
        throw Error('Not a valid piece or square');
    }
    // selectedPiece.element.style.backgroundColor = "";
    previousMovedSquare = squares[parseInt(position)].div;
    previousMovedSquare.style.backgroundColor = previousSquareColor;

    previousMovedPiece = selectedPiece;
    // after moving the piece we switch player turn
    currentPlayer = currentPlayer === WHITE_PIECE ? BLACK_PIECE : WHITE_PIECE;

    return null;
}

/**
 * Returns the color of the selected piece
 * @param {Element} piece The html element representing the piece
 */
function getPieceColor(piece) {
    const pieceType = piece.className.match(/\b[w|b][a-z]\b/gi);
    return pieceType[0][0] == WHITE_PIECE ? WHITE_PIECE : BLACK_PIECE;
}

// /**
//  * Verify if a piece can be moved in the current turn
//  */
// function checkTurn(currentPlayer) {

//     // if it is not the turn of the right player he cannot move the piece
//     if (currentPlayer !== selectedPiece.color) {

//     }
// }   