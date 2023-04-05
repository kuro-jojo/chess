// import { Socket } from "socket.io";
import * as C from "./consts.js";
import * as Pieces from "./pieces.js";

/**
 * Initiates a new game against the specified opponent
 * @param {string} myId the id of the current user
 * @param {string} opponentId the id of the opponent
 * @param {Socket} socket 
 */
export function initiateGame(myId, opponentId, socket) {
    console.log('Initiating game ...')
    if (myId != opponentId) {
        socket.emit('gameStarted', [myId, opponentId]);
    } else {
        alert('Sorry !!! You cannot play against yourself 😊');
    }
}

/**
 * 
 * @param {Socket} socket 
 * @param {string} myId 
 * @param {[T.Square]} squares 
 * @param {{ currentIdColor, opponentId}} idObject 
 */
export function setUpSocketListeners(socket, myId, squares, idObject) {
    // let currentIdColor;
    //Accepts a game started by an opponent
    // let opponentId;
    console.log('Setting up socket listeners ...');
    socket.on('gameStarted', gameStarted => {
        if (gameStarted[1] == myId) {
            idObject.currentIdColor = Math.random() < 0.5 ? C.WHITE_PIECE : C.BLACK_PIECE;

            console.log('Accepting game ...');
            alert('Your opponent has started a game with you. You are playing as ' + (idObject.currentIdColor == C.WHITE_PIECE ? 'white' : 'black') + '.');

            idObject.opponentId = gameStarted[0];
            document.getElementById("opponent-id-display").innerHTML = idObject.opponentId;

            // send the opponent color
            gameStarted[2] = idObject.currentIdColor == C.WHITE_PIECE ? C.BLACK_PIECE : C.WHITE_PIECE;
            socket.emit('gameAccepted', gameStarted);
        }
    });

    //Starts a game accepted by an opponent
    socket.on('gameAccepted', gameAccepted => {

        if (gameAccepted[0] == myId) {
            // retrieve the opponent color
            idObject.currentIdColor = gameAccepted[2];

            console.log('Starting game ...');
            alert('Your are playing as ' + (idObject.currentIdColor == C.WHITE_PIECE ? 'white' : 'black') + '.');

            idObject.opponentId = gameAccepted[1];
            document.getElementById("opponent-id-display").innerHTML = idObject.opponentId;
            idObject.currentIdColor = C.WHITE_PIECE;
        } else {
            console.log('Not an opponent ...');
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
    socket.on('disconnect', () => {
        console.log('Socket disconnected!');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
}
