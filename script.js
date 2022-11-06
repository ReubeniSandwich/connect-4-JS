const board = document.getElementById("board")
const coordinates = document.getElementById("user-coordinates")
const input = document.getElementById("submit-button")

class Token {
    constructor(column, row, player) {
        this.column = column
        this.row = row
        this.player = player
    }
}

// const moveList = [new Token(0, 0, 1), new Token(1, 0, 1), new Token(2, 0, 1)];
const moveList = [];

input.addEventListener("click", () => runMove(moveList));

function runMove(moveList) {

    // todo this is bad and I need a better way to edit this
    var moveListLocal = moveList  

    const rawCoordinates = coordinates.value

    // todo add inputValidation 
    const tokenized = rawCoordinates.split(" ")
    const column = parseInt(tokenized[0])
    const row = parseInt(tokenized[1])
    const player = parseInt(tokenized[2])

    const token = new Token(column, row, player)

    if (isValidMove(token, moveListLocal) === false) {
        console.log("bad move, try again");
        return
    }
    console.log("valid move!");

    moveListLocal.push(token)
    //todo html & css
    // addPiece(token)
    checkForWinner(moveListLocal, token)


    
}

function isValidMove(token, moveList) {
// todo board size variables
    // board is 7 columns x 6 rows. array starts at 0
    if (token.row > 5 || token.row < 0 || token.column > 6 || token.column < 0) {
        return false;
    }

    return isEmptySlot(token, moveList)
}

function isEmptySlot(token, moveList) {

    const isColumnBelow = moveList.some(piece => (token.row -1) === piece.row && token.column == piece.column)

    if (isColumnBelow === false && token.row != 0) {
        console.log(token.column);
        console.log("bad move!");
        return false
    }

    return !moveList.some(piece => token.row === piece.row && token.column === piece.column)
}

function addPiece(token) {
    const egg = document.createElement('div')
    egg.className = "red"
    board.appendChild(egg)
    
}

function checkForWinner(myMoveList, token) {

    const playerId = token.player
    const playerMoves = myMoveList.filter(move => playerId === move.player)

    console.log(myMoveList);

    const horizontal = checkHorizontal(playerMoves)
    if (horizontal != null) {
        announceWinner(playerId, horizontal)
        return
    } 

    const vertical = checkVertical(playerMoves)
    if (vertical != null) {
        announceWinner(playerId, vertical)
        return
    } 

    const diagonal = checkDiagonal(playerMoves)
    if (diagonal != null) {
        announceWinner(playerId, diagonal)
        return
    } 

}


function announceWinner(playerId, winnerList) {
    console.log("WINNER WINNER");
    console.log("Player " + playerId + " Won!");
    console.log(winnerList);
}


function checkHorizontal(playerMoves) {
    const sortedColumnArray = playerMoves.sort(function(a, b) {
        return a.column - b.column;
      });

    const response = recurse(sortedColumnArray, 'column', 0, [])
    return response
}

function checkVertical(playerMoves) {
    const sortedRowArray = playerMoves.sort(function(a, b) {
        return a.row - b.row;
      });

    const response = recurse(sortedRowArray, 'row', 0, [])
    return response
}

function checkDiagonal(playerMoves) {
    
    
    //todo
    // horizontal top L to bottom R --> \
    // add 1 to column remove 1 from row

    // 0 3
    // 1 2
    // 2 1
    // 3 0

    // 2 4
    // 3 3
    // 4 2
    // 5 1

    //todo
    // horizontal bottom L to top R --> /
    // add +1 to column and row
    
    // 0 0
    // 1 1
    // 2 2
    // 3 3

    // 1 0
    // 2 1
    // 3 2
    // 4 3


}

// playerMoves: list of playerMoves for the current playerId
// field: what property in each playerMoves array index (token) I use to check if it is a sequence. i.e row or column
// indexValue: what index value to input into playerMoves. Probably should alwasy be 0 ... playerMoves[indexValue]
// winList: the list of values that are in sequence ... 1 2 3 4 .... 3 4 5 6 ... useful to show the winning collection
// Returns: If winList.length == 4, return winList. Return null if at end of the playerMoves array and winList length != 4. 
function recurse(playerMoves, field, indexValue, winList) {
    
    if (winList.length === 4) {
        return winList
    }

    // There is no nextToken
    if (indexValue >= (playerMoves.length - 1)) {
        return null
    }
    
    const currToken = playerMoves[indexValue]
    const nextToken = playerMoves[(indexValue + 1)]

    // Check if this is a sequence of numbers. The current token should equal the next token if you add 1
    if ((currToken[field] + 1) === nextToken[field]) {
        
        if (winList.length == 0) { winList.push(currToken) }
        winList.push(nextToken)

        return recurse(playerMoves, field, (indexValue + 1), winList)
    } else {
        return recurse(playerMoves, field, (indexValue + 1), [])
    }
}