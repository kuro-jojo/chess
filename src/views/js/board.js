import * as C from "./consts.js";
import * as Pieces from "./pieces.js";
import * as T from "./types.js";

const socket = io('ws://156.18.66.184:3000');
import { initiateGame } from "./socket.js";

let myId;
let opponentId;
let playerColor;
let currentPlayer = C.WHITE_PIECE;
const flipClass = 'flip';

let kingIsInCheck = false; // check if the king of the player is in check

const playerIdElement = document.getElementById("player-id");
(function generateId() {
    // generate a random id
    myId = makeid(4);
    playerIdElement.innerHTML = myId;
})();

// set up socket listeners
// setUpSocketListeners(socket, myId);

// get the chess board and pieces from the DOM
const board = document.getElementById("board-single");
const gridOverlay = document.getElementById("grid-overlay");
const pieces = document.querySelectorAll(".piece");

const selectedPieceSquareColor = "rgba(165, 126, 53, 0.7)";
const previousSquareColor = "rgba(165, 126, 53, 0.5)";
const pieceDefaultBackGroundColor = "inherit";
const kingInCheckBackGroundColor = "orange";

const playButton = document.getElementById("play-button");
// get the playerId

// TODO:
// const capturedPieces = new Map();

// color of the player
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



function rotateBoard() {
    board.classList.toggle("rotateBoard");
    pieces.forEach((piece) => {
        piece.style.background = "none";
        piece.classList.add(flipClass);
    });
}
/**
 * @type {T.Square[]}
 */
let squares = (function () {

    /**
     * @type {T.Square[]}
     */
    let tmp_squares = []
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
            tmp_squares[parseInt("" + col + row)] = square;
        }
    }

    // TODO: Fix pawn not seeing last ranks ennemies

    (function init() {
        const rows = [1, 2, 7, 8];
        for (let col = 1; col <= 8; col++) {
            // pawns on 2 and 7 rank
            tmp_squares[parseInt(`${col}${rows[1]}`)].piece = new Pieces.Pawn(C.WHITE_PIECE);
            tmp_squares[parseInt(`${col}${rows[2]}`)].piece = new Pieces.Pawn(C.BLACK_PIECE);
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
                    tmp_squares[parseInt(`${1}${row}`)].piece = new Pieces.Rook(color);
                    tmp_squares[parseInt(`${8}${row}`)].piece = new Pieces.Rook(color);
                    break;
                case C.BISHOP:
                    tmp_squares[parseInt(`${3}${row}`)].piece = new Pieces.Bishop(color);
                    tmp_squares[parseInt(`${6}${row}`)].piece = new Pieces.Bishop(color);
                    break;
                case C.KNIGHT:
                    tmp_squares[parseInt(`${2}${row}`)].piece = new Pieces.Knight(color);
                    tmp_squares[parseInt(`${7}${row}`)].piece = new Pieces.Knight(color);
                    break;
                case C.QUEEN:
                    tmp_squares[parseInt(`${4}${row}`)].piece = new Pieces.Queen(color);
                    break;
                case C.KING:
                    tmp_squares[parseInt(`${5}${row}`)].piece = new Pieces.King(color);
                    break;
                default:
                    break;
            }
        }
    })();
    return tmp_squares;
})();

// add event listener to play button
playButton.addEventListener("click", () => {
    if (document.getElementById("opponent-id").value != "") {
        initiateGame(myId, document.getElementById("opponent-id").value, socket);
    }
});


// set up the board with the pieces in their starting positions


// setUpSocketListeners(socket, myId, squares, idObj);
// ({ currentIdColor, opponentId } = idObj);

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

                sq.forEach(s => {
                    // if in the square there is the piece we select now we move the selected piece into that square
                    if (s && s === tmp_piece.position) {
                        playerMadeCapture = true;
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

                piece.style.backgroundColor = selectedPieceSquareColor;
                selectedPiece = createPieceObjectByHtmlElement(piece);
            }
            getAvailableMoves(selectedPiece);
        }
    });
});


socket.on('gameStarted', gameStarted => {
    if (gameStarted[1] == myId) {
        playerColor = Math.random() < 0.5 ? C.WHITE_PIECE : C.BLACK_PIECE;
        if (playerColor === C.BLACK_PIECE) {
            rotateBoard()
        }
        console.log('Accepting game ...');
        alert('Your opponent has started a game with you. You are playing as ' + (playerColor == C.WHITE_PIECE ? 'white' : 'black') + '.');

        opponentId = gameStarted[0];
        document.getElementById("opponent-id-display").innerHTML = opponentId;

        // send the opponent color
        gameStarted[2] = playerColor === C.WHITE_PIECE ? C.BLACK_PIECE : C.WHITE_PIECE;
        socket.emit('gameAccepted', gameStarted);
    }
});

//Starts a game accepted by an opponent
socket.on('gameAccepted', gameAccepted => {

    if (gameAccepted[0] == myId) {
        // retrieve the opponent color
        playerColor = gameAccepted[2];
        if (playerColor === C.BLACK_PIECE) {
            rotateBoard()
        }
        console.log('Starting game ...');
        alert('Your are playing as ' + (playerColor == C.WHITE_PIECE ? 'white' : 'black') + '.');

        opponentId = gameAccepted[1];
        document.getElementById("opponent-id-display").innerHTML = opponentId;
    } else {
        console.log('Not an opponent ...');
    }
});

socket.on('movePiece', function (squrs) {
    if (squrs[3] != myId) {
        console.log('Receiving move ...');
        squrs[0].element = document.getElementsByClassName(JSON.parse(squrs[4]).className.replace(flipClass, ''))[0];

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

socket.on('disconnect', () => {
    console.log('Socket disconnected!');
});

socket.on('error', (err) => {
    console.error('Socket error:', err);
});

/**
 * 
 * @param {Pieces.Piece} piece 
 * @returns 
 */
function createPiece(piece) {
    if (!piece) {
        return piece;
    }
    switch (piece.constructor.type) {
        case C.PAWN:
            return new Pieces.Pawn(piece.color, piece.hasMoved);
        case C.KNIGHT:
            return new Pieces.Knight(piece.color, piece.hasMoved);
        case C.BISHOP:
            return new Pieces.Bishop(piece.color, piece.hasMoved);
        case C.ROOK:
            return new Pieces.Rook(piece.color, piece.hasMoved);
        case C.QUEEN:
            return new Pieces.Queen(piece.color, piece.hasMoved);
        case C.KING:
            return new Pieces.King(piece.color, piece.hasMoved);
    }
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
    const squareNewPostionClassName = `square-${squareToMove.col}${squareToMove.row}`;
    const currentPosition = "" + selectedPiece.position.col + selectedPiece.position.row;

    // check sytem
    const backupSquarePiece = createPiece(squareToMove.piece);
    const backupCurrentPiece = createPiece(selectedPiece.object);

    // update the square where the piece is moved
    squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece = selectedPiece.object;
    squares[parseInt(currentPosition)].piece = null;

    const [kCheck, kPos] = isKingInCheck(selectedPiece.object.color);
    // restore the previous state
    squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece = backupSquarePiece;
    squares[parseInt(currentPosition)].piece = backupCurrentPiece;

    // if the move make the king to be in check we cancel it
    if (kCheck) {
        selectedPiece.position.piece = selectedPiece.object;
        kingIsInCheck = true;
        return selectedPiece;
    }
    if (kingIsInCheck && currentPlayer === playerColor) {
        // alert("You are no longer in check");
        kingIsInCheck = false;
        if (selectedPiece.type === C.KING) {
            squares[parseInt(`${selectedPiece.position.col}${selectedPiece.position.row}`)].piece.isInCheck = false;
            squares[parseInt(`${selectedPiece.position.col}${selectedPiece.position.row}`)].div.style.backgroundColor = pieceDefaultBackGroundColor;
        } else {
            squares[parseInt(`${kPos[0]}${kPos[1]}`)].piece.isInCheck = false;
            squares[parseInt(`${kPos[0]}${kPos[1]}`)].div.style.backgroundColor = pieceDefaultBackGroundColor;
        }

    }
    // CASTLING
    if ((selectedPiece.type === C.KING && !selectedPiece.object.hasMoved && !selectedPiece.object.isInCheck)) {
        kingCastling(selectedPiece, squareToMove, noskip);
    }
    // move the piece

    piece.className = piece.className.replace(
        /square-\d+/,
        squareNewPostionClassName,
    );

    if (toCapturePiece) {
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
        socket.emit('movePiece', [selP, sqtm, toCapturePiece, myId, elementJson, pieceJSON, pieceJSON2]);

    }
    // if it's a pawn make sure not to have the possibility to move up 2 squares
    squareToMove.piece = selectedPiece.object;

    // update the square where the piece is moved
    if (selectedPiece.type === C.PAWN || selectedPiece.type === C.KING || selectedPiece.type === C.ROOK) {
        squareToMove.piece.hasMoved = true;
    }
    squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece = squareToMove.piece;
    squares[parseInt(currentPosition)].piece = null;

    const [kingInCheck, kingPosition] = isKingInCheck(currentPlayer);
    //let isKingInCheck= false;

    if (kingInCheck) {
        if (checkmate(currentPlayer, noskip)) {
            alert("Checkmate");
            socket.emit('checkmate', [myId, currentPlayer]);
        }
        const king = squares[parseInt(`${kingPosition[0]}${kingPosition[1]}`)];
        if (currentPlayer === playerColor) {
            kingIsInCheck = true;
            squares[parseInt(`${kingPosition[0]}${kingPosition[1]}`)].piece.isInCheck = true;
            squares[parseInt(`${kingPosition[0]}${kingPosition[1]}`)].div.style.backgroundColor = kingInCheckBackGroundColor;
            
        }
        return null;

    } else if (currentPlayer === playerColor && kingIsInCheck) {
        squares[parseInt(`${kingPosition[0]}${kingPosition[1]}`)].piece.isInCheck = false;
        squares[parseInt(`${kingPosition[0]}${kingPosition[1]}`)].div.style.backgroundColor = pieceDefaultBackGroundColor;

        kingIsInCheck = false;
    }
    return null;
}

/**
 * whether the king is checkmated or not
 * @param {string} pieceColor 
 * @param {boolean} noskip 
 * @returns {boolean} true if the king is checkmated
 */
function checkmate(pieceColor, noskip) {
    for (let s = 0; s < squares.length; s++) {
        const square = squares[s];
        if (square && square.piece && square.piece.color === pieceColor) {
            const htmlPiece = document.getElementsByClassName('square-' + square.col + square.row)[0];
            if (htmlPiece) {
                const selectedPiece = createPieceObjectByHtmlElement(htmlPiece);
                const currentPosition = "" + selectedPiece.position.col + selectedPiece.position.row;
                if (selectedPiece) {
                    const moves = getAvailableMoves(selectedPiece, false, noskip, true);
                    for (let i = 0; i < moves.length; i++) {
                        const squareToMove = moves[i];
                        // check sytem
                        const backupSquarePiece = squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece;
                        const backupCurrentPiece = squares[parseInt(currentPosition)].piece;
                        // update the square where the piece is moved
                        squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece = selectedPiece.object;
                        squares[parseInt(currentPosition)].piece = null;

                        const [kCheck, kPos] = isKingInCheck(selectedPiece.object.color);
                        // restore the previous state
                        squares[parseInt(`${squareToMove.col}${squareToMove.row}`)].piece = backupSquarePiece;
                        squares[parseInt(currentPosition)].piece = backupCurrentPiece;

                        // if the move doesn't cover the check
                        if (kCheck) {
                            continue;
                        }
                        return false;
                    }
                }
            }
        }
    }
    console.log('GAME OVER')

    return true;
}

/**
 * 
 * @param {T.Piece} selectedPiece 
 * @param {T.Square} squareToMove 
 * @param {boolean} noskip True if we just retransmit the move
 */
function kingCastling(selectedPiece, squareToMove, noskip) {
    // if the square to move is for short castling
    let rook = null;
    let rookPosition = null;
    const squarePositionClassName = /square-\d+/;
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
        // only said that the rook and king have moved if it's a retransmission
        if (!noskip) {
            rookSquare.piece.hasMoved = true;
            selectedPiece.object.hasMoved = true;
        }
        rook[0].className = rook[0].className.replace(
            squarePositionClassName,
            rookNewPosition
        );
        // // update the rook position in the squares array
        squares[parseInt(rookPosition.match(/\d{2}/)[0])].piece = null;
        // squares[parseInt(rookNewPosition.match(/\d{2}/)[0])].piece.possibleMoves=[];
        // rookSquare.piece.possibleMoves = [];
        squares[parseInt(rookNewPosition.match(/\d{2}/)[0])].piece = rookSquare.piece;

        // // remove the selected piece from the squares.
        // squares[parseInt(rookPosition.match(/\d{2}/)[0])].div.className = "square";
    }
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
 * Returns the color and the type of the selected piece
 * @param {Element} piece The html element representing the piece
 * @returns {{color:string, type:string, pieceObject: Pieces.Piece, position:T.Square}}
 */
function getPieceProperties(piece) {
    const properties = {};
    const pieceType = piece.className.match(/\b[w|b][a-z]\b/gi);

    properties.color = pieceType[0][0] == C.WHITE_PIECE ? C.WHITE_PIECE : C.BLACK_PIECE;
    properties.type = pieceType[0][1];

    properties.position = getPiecePositionSquare(piece);
    const sq = squares[parseInt(`${properties.position.col}${properties.position.row}`)];

    if (properties.position.piece) {
        properties.pieceObject = sq.piece;
        return properties;
    }
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
function getAvailableMoves(selectedPiece, toDisplay = true, noskip = true, forCheckmate = false) {

    if (!selectedPiece) {
        return;
    }

    if ((currentPlayer === selectedPiece.color && playerColor === selectedPiece.color) || (selectedPiece.color === currentPlayer && !noskip) || (forCheckmate)) {
        const position = [selectedPiece.position.col, selectedPiece.position.row]
        /**
         * @type {T.Square[]}
         */
        let moves = [];
        // if (selectedPiece.position.piece) {
        //     moves = selectedPiece.position.piece.getPossibleMoves(position, squares);
        // } else {
        moves = selectedPiece.object.getPossibleMoves(position, squares);
        // }

        displayAvailableMoves(moves, toDisplay);

        return moves;
    }

    return []
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

function isKingInCheck(kingColor) {

    const king = squares.find(square => {
        return square && square.piece && square.piece.constructor.type === C.KING && square.piece.color === kingColor;
    });

    const kingPosition = [king.col, king.row];

    const opponentPieces = squares.filter((square) => {
        return square && square.piece && square.piece.color !== kingColor;
    });

    const opponentMoves = opponentPieces.map((square) => {
        if (square && square.piece)
            return square.piece.getPossibleMoves([square.col, square.row], squares);
        return [];
    });

    const opponentMovesFlatten = opponentMoves.reduce((acc, val) => acc.concat(val), []);

    const isKingInCheck = opponentMovesFlatten.some((square) => {
        return square.col === kingPosition[0] && square.row === kingPosition[1];
    });
    return [isKingInCheck, kingPosition];
}