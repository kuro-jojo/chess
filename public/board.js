// get the chess board and pieces from the DOM
const board = document.getElementById("board-single");
const gridOverlay = document.getElementById("grid-overlay")
const pieces = document.querySelectorAll(".piece");
const selectedPieceSquareColor = "rgba(165, 126, 53, 0.7)"
// const boardRect = board.getBoundingClientRect();


// track the currently selected piece
let selectedPiece = null;

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
                row: row,
                col: col,
                // x: col * cellWidth,
                // y: row * cellHeight,
                width: cellWidth,
                height: cellHeight,
                div: squareDiv,
            };
            squareDiv.addEventListener('click', event => {
                if (selectedPiece) {
                    // move the piece
                    movePiece(selectedPiece, square);
                }
            });
        }
    }
})();


function movePiece(selectedPiece, square) {

    const piece = selectedPiece.element;
    const pieceClassName = piece.className;

    // Change the piece square's
    const squarePositionByClassName = /square-\d+/;
    const squareNewPostionByClassName = 'square-' + square.col + square.row;
    
    if (pieceClassName.match(squarePositionByClassName) !== null) {
        piece.className = piece.className.replace(squarePositionByClassName, squareNewPostionByClassName);
    }else {
        throw Error('Not a valid piece or square');
    }
    selectedPiece.element.style.backgroundColor = "";
    selectedPiece = null;
}

