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

const capturedPieces = new Map();

// First player is white
let currentPlayer = C.WHITE_PIECE;

// Player's id
let myId;
let playerId = document.getElementById("player-id");
// get the playerId

// Opponent's id
let opponentId = "";

(function generateId() {
    // generee
    myId = makeid(4);
    playerId.innerHTML = myId;
})();

// color of the player
let currentIdColor = C.WHITE_PIECE;
let playerMadeCapture = false;
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

    /**
     * @type {T.Square[]}
     */
    let squares = []
    // Iterate through each cell in the grid
    for (let row = 8; row >= 1; row--) {
        for (let col = 1; col <= 8; col++) {
            let squareDiv = document.createElement("div");
            // Get the dimensions of each cell in the grid
            let cellWidth = board.clientWidth / 8;
            let cellHeight = board.clientHeight / 8;

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
            }

            squareDiv.addEventListener("click", (event) => {
                if (selectedPiece) {
                    // move the piece
                    selectedPiece = movePiece(selectedPiece, square, false);
                }
            });
            squares[parseInt("" + col + row)] = square;
        }
    }

    // TODO: Fix pawn not seeing last ranks ennemies

    (function init() {
        const rows = [1, 2, 7, 8];
        for (let col = 1; col <= 8; col++) {
            // pawns on 2 and 7 rank
            squares[parseInt(`${col}${rows[1]}`)].piece = new Pieces.Pawn(C.WHITE_PIECE);
            squares[parseInt(`${col}${rows[2]}`)].piece = new Pieces.Pawn(C.BLACK_PIECE);
        }
        // 1. White , 8. Black
        init_pieces(1, C.ROOK);
        init_pieces(8, C.ROOK);
        init_pieces(1, C.BISHOP);
        init_pieces(8, C.BISHOP);
        init_pieces(1, C.KNIGHT);
        init_pieces(8, C.KNIGHT);
        init_pieces(1, C.QUEEN);
        init_pieces(8, C.QUEEN);
        init_pieces(1, C.KING);
        init_pieces(8, C.KING);

        // init pieces
        function init_pieces(row, type) {
            const color = row === 1 ? C.WHITE_PIECE : C.BLACK_PIECE;
            switch (type) {
                case C.ROOK:
                    squares[parseInt(`${1}${row}`)].piece = new Pieces.Rook(color);
                    squares[parseInt(`${8}${row}`)].piece = new Pieces.Rook(color);
                    break;
                case C.BISHOP:
                    squares[parseInt(`${3}${row}`)].piece = new Pieces.Bishop(color);
                    squares[parseInt(`${6}${row}`)].piece = new Pieces.Bishop(color);
                    break;
                case C.KNIGHT:
                    squares[parseInt(`${2}${row}`)].piece = new Pieces.Knight(color);
                    squares[parseInt(`${7}${row}`)].piece = new Pieces.Knight(color);
                    break;
                case C.QUEEN:
                    squares[parseInt(`${4}${row}`)].piece = new Pieces.Queen(color);
                    break;
                case C.KING:
                    squares[parseInt(`${5}${row}`)].piece = new Pieces.King(color);
                    break;
                default:
                    break;
            }
        }
    })();
    return squares;
})();

// add event listener to play button
play.addEventListener("click", () => {
    if (document.getElementById("opponent-id").value != "") {
        initiateGame(document.getElementById("opponent-id").value);
    }
});

// add event listeners to each chess piece
pieces.forEach((piece) => {
    piece.addEventListener("click", () => {

        if (opponentId != "") {
            // set the starting position of the piece
            piece.style.position = "absolute";
            piece.style.left = "0";
            piece.style.top = "0";

            // hide the availables moves when another piece is selected 
            if (selectedPiece) {
                const sq = getAvailableMoves(selectedPiece, false);
                let p = [];
                const tmp_piece = createPieceObjectByHtmlElement(piece);

                let i = 0;
                sq.forEach(s => {
                    // if in the square there is the piece we select now we move the selected piece into that square
                    if (s && s === tmp_piece.position) {
                        playerMadeCapture = true;
                        console.log(i, s.piece);
                        if (s.piece) {
                            const pm = s.piece.possibleMoves;
                            pm.forEach(p => {
                                p.piece = null;
                            });
                        }
                        i = i + 1;
                        movePiece(selectedPiece, s, true);
                        return
                    }
                });
                // if it is player turn and he already selected a piece then if he tried to select another capturable piece we capture it

            }
            if (playerMadeCapture) {
                playerMadeCapture = false;
                return;
            }
            if (selectedPiece && selectedPiece.element === piece) {
                piece.style.backgroundColor = "";
                selectedPiece = null;

            } else if (selectedPiece == null || selectedPiece.element !== piece) {

                // store the current position of the piece
                if (selectedPiece !== null && selectedPiece.element !== piece) {
                    selectedPiece.element.style.backgroundColor = "";
                    // when we captured a piece the square is auto selected so we avoid that
                    getAvailableMoves(selectedPiece, false);
                }
                console.log(selectedPiece);
                piece.style.backgroundColor = selectedPieceSquareColor;
                selectedPiece = createPieceObjectByHtmlElement(piece);
            }
            console.log(piece);

            getAvailableMoves(selectedPiece);
        }
    });
});

//Accepts a game started by an opponent
socket.on('gameStart', gameStart => {
    if (gameStart[1] == myId) {
        console.log('Accepting game ...');
        socket.emit('gameAccepted', gameStart);
        opponentId = gameStart[0];
        currentIdColor = C.BLACK_PIECE;
    }
});

//Starts a game accepted by an opponent
socket.on('gameAccepted', gameAccepted => {

    if (gameAccepted[0] == myId) {
        console.log('Starting game ...');
        opponentId = gameAccepted[1];
        document.getElementById("opponent-id-display").innerHTML = opponentId;
        currentIdColor = C.WHITE_PIECE;
    }
});

socket.on('squares', function (squrs) {
    if (squrs[3] != myId) {
        console.log('Receiving move ...');
        squrs[0].element = document.getElementsByClassName(JSON.parse(squrs[4]).className)[0];

        squrs[0] = createPieceObjectByHtmlElement(squrs[0].element)

        const pc = JSON.parse(squrs[5]);
        squrs[1].piece = new Pieces.Piece(pc["color"]);
        switch (pc.type) {
            case C.PAWN:
                squrs[1].piece = new Pieces.Pawn(pc["color"]);
                break;
            case C.KNIGHT:
                squrs[1].piece = new Pieces.Knight(pc["color"]);
                break;
            case C.BISHOP:
                squrs[1].piece = new Pieces.Bishop(pc["color"]);
                break;
            case C.ROOK:
                squrs[1].piece = new Pieces.Rook(pc["color"]);
                break;
            case C.QUEEN:
                squrs[1].piece = new Pieces.Queen(pc["color"]);
                break;
            case C.KING:
                squrs[1].piece = new Pieces.King(pc["color"]);
                break;
            default:
                break;
        }

        squrs[1].div = squares["" + squrs[1].col + squrs[1].row].div;
        movePiece(squrs[0], squrs[1], squrs[2], false);
    }
});

/**
 * Initiates a new game against the specified opponent
 * @param {String} opponentId - The id of the opponent
 * @returns {void}
 */
function initiateGame(opponentId) {
    console.log('Initiating game ...')
    socket.emit('gameStart', [myId, opponentId]);
}


/**
 * 
 * @param {HtmlElement} piece 
 */
function createPieceObjectByHtmlElement(piece) {
    return {
        element: piece,
        color: getPieceProperties(piece).color,
        type: getPieceProperties(piece).type,
        object: getPieceProperties(piece).pieceObject,
        position: getPieceProperties(piece).position,
    };
}

/**
 *
 * @param {T.Piece} selectedPiece
 * @param {T.Square} squareToMove the square where to move the piece
 * @param {boolean} toCapturePiece if or not the move is aim to capture a piece
 * @returns {T.Piece|null}
 */
function movePiece(selectedPiece, squareToMove, toCapturePiece = false, noskip = true) {
    const selP = { ...selectedPiece };
    const sqtm = { ...squareToMove };

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

    let incl = false;
    getAvailableMoves(selectedPiece, false, noskip).forEach(move => {
        if (move.col === squareToMove.col && move.row === squareToMove.row) {
            incl = true;
            return;
        }
    });

    if (!incl) {
        selectedPiece.element.style.backgroundColor = "";
        return null;
    }

    const pieceSave = selectedPiece.element.cloneNode(true);

    const piece = selectedPiece.element;
    const squarePositionClassName = /square-\d+/;
    const squareNewPostionClassName = `square-${squareToMove.col}${squareToMove.row}`;
    const currentPosition = "" + selectedPiece.position.col + selectedPiece.position.row;

    // if is the king
    if ((selectedPiece.type === C.KING && !selectedPiece.object.hasMoved) || (selectedPiece.type === C.KING && selectedPiece.object.hasMoved && !noskip)) {

        // if the square to move is for short castling
        let rook = null;
        let rookPosition = null;
        /**
         * @type {T.Square}
         */
        let rookSquare = {
            width: squareToMove.width,
            height: squareToMove.height,
            row: squareToMove.row,
        };

        let rookNewPosition = null;

        if (squareToMove.col === 7 && (getAvailableMoves(selectedPiece, false, noskip).includes(squareToMove) || (!noskip))) {
            rookPosition = `${8}${squareToMove.row}`;
            rookSquare.col = squareToMove.col - 1;

        }
        // if the square to move is for long castling
        else if (squareToMove.col === 3 && getAvailableMoves(selectedPiece, false, noskip).includes(squareToMove) || (!noskip)) {
            rookPosition = `${1}${squareToMove.row}`;
            rookSquare.col = squareToMove.col + 1;
        }

        rook = document.getElementsByClassName(`square-${rookPosition}`);

        if (rook[0]) {
            rookNewPosition = `square-${rookSquare.col}${rookSquare.row}`;
            rookSquare.div = squareToMove.div;
            rookSquare.piece = squares[parseInt(rookPosition.match(/\d{2}/)[0])].piece;
            rookSquare.piece.hasMoved = true;
            selectedPiece.object.hasMoved = true;

            rook[0].className = rook[0].className.replace(
                squarePositionClassName,
                rookNewPosition
            );
            // // update the rook position in the squares array
            squares[parseInt(rookPosition.match(/\d{2}/)[0])].piece = null;
            // squares[parseInt(rookNewPosition.match(/\d{2}/)[0])].piece.possibleMoves=[];
            rookSquare.piece.possibleMoves = [];
            squares[parseInt(rookNewPosition.match(/\d{2}/)[0])].piece = rookSquare.piece;

            // // remove the selected piece from the squares.
            // squares[parseInt(rookPosition.match(/\d{2}/)[0])].div.className = "square";
        }
    }
    // move the piece

    piece.className = piece.className.replace(
        squarePositionClassName,
        squareNewPostionClassName,
    );

    if (toCapturePiece) {
        console.log(getAvailableMoves(selectedPiece, false, noskip));

        // save the piece captured with the num of move as key
        // capturedPieces.set(squareToMove.piece, )
        // remove the captured piece from the board
        const elements = document.getElementsByClassName(
            `${squareNewPostionClassName} 
            ${squareToMove.piece.color}${squareToMove.piece.constructor.type}`
        );
        elements[0].parentNode.removeChild(elements[0]);
    }

    // we store this square move which will stay highlighted
    previousMovedSquare = squares[parseInt(currentPosition)].div;
    previousMovedSquare.style.backgroundColor = previousSquareColor;

    previousMovedPiece = selectedPiece;

    // after moving the piece we switch player turn
    currentPlayer = currentPlayer === C.WHITE_PIECE ? C.BLACK_PIECE : C.WHITE_PIECE;
    // let sq = squares[squares.indexOf(squareToMove)] ;


    // else {
    //     // check if opponent king is in check
    //     console.log("checking if king is in check");

    // }



    if (noskip) {

        const elementData = {
            id: pieceSave.id,
            className: pieceSave.className,
            textContent: pieceSave.textContent,
            style: {
                backgroundColor: pieceSave.style.backgroundColor,
            }
            // Add other properties as needed
        };

        const elementJson = JSON.stringify(elementData);

        const pieceJ = {};
        if (squareToMove.piece) {
            pieceJ.color = squareToMove.piece.color;
            // pieceJ.possibleMoves = JSON.stringify(squareToMove.piece.possibleMoves);
            pieceJ.type = squareToMove.piece.constructor.type;
        } else {
            pieceJ.color = "";
            // pieceJ.possibleMoves = JSON.stringify([]);
            pieceJ.type = "";
        }

        const pieceJSON = JSON.stringify(pieceJ);

        const pieceJ2 = {
            color: selectedPiece.object.color,
            // possibleMoves: JSON.stringify(selectedPiece.object.possibleMoves),
            // Add other properties as needed
        };

        const pieceJSON2 = JSON.stringify(pieceJ2);

        socket.emit('squares', [selP, sqtm, toCapturePiece, myId, elementJson, pieceJSON, pieceJSON2]);

    }
    // if it's a pawn make sure not to have the possibility to move up 2 squares
    squareToMove.piece = selectedPiece.object;

    if (selectedPiece.type === C.PAWN || selectedPiece.type === C.KING || selectedPiece.type === C.ROOK) {
        squareToMove.piece.hasMoved = true;
    }
    // update the square where the piece is moved
    squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece = squareToMove.piece;
    squares[parseInt(currentPosition)].piece = null;

    const [isKingInCheck, kingPosition] = kingInCheck(currentPlayer);
    //let isKingInCheck= false;
    if (isKingInCheck) {
        console.log(currentPlayer + "king in check");
        const king = squares[parseInt(`${kingPosition[0]}${kingPosition[1]}`)];
        king.div.style.backgroundColor = "green";
        console.log(king)
        return null;
    }
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
 * 
 * @returns {T.Square[]} list of all available squares to move
 */
function getAvailableMoves(selectedPiece, toDisplay = true, noskip = true) {

    if (!selectedPiece) {
        return;
    }

    if ((selectedPiece.color === currentPlayer && currentIdColor === selectedPiece.color) || (selectedPiece.color === currentPlayer && !noskip)) {
        const position = [selectedPiece.position.col, selectedPiece.position.row]
        /**
         * @type {T.Square[]}
         */
        let moves = [];
        console.log("fff", selectedPiece.position.piece)
        if (selectedPiece.position.piece) {
            moves = selectedPiece.position.piece.getPossibleMoves(position, squares);
        } else {
            moves = selectedPiece.object.getPossibleMoves(position, squares);
        }
        console.log(moves)
        displayAvailableMoves(moves, toDisplay);

        return moves;
    }

    return []
}
/**
 * 
 * @param {T.Square} squareToMove 
 */
function capturePiece(squareToMove) {

}

function displayAvailableMoves(moves, toDisplay) {
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
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function kingInCheck(kingColor) {

    const king = squares.find(square => {
        return square && square.piece && square.piece.constructor.type === C.KING && square.piece.color === kingColor;
    });

    const kingPosition = [king.col, king.row];

    const opponentPieces = squares.filter((square) => {
        return square && square.piece && square.piece.color !== kingColor;
    });

    const opponentMoves = opponentPieces.map((square) => {
        if (square)
            return square.piece.getPossibleMoves([square.col, square.row], squares);
        return [];
    });

    const opponentMovesFlatten = opponentMoves.reduce((acc, val) => acc.concat(val), []);

    const isKingInCheck = opponentMovesFlatten.some((square) => {
        return square.col === kingPosition[0] && square.row === kingPosition[1];
    });
    console.log("isKingInCheck", kingColor)
    return [isKingInCheck, kingPosition];
}