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
