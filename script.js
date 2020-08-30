// get canvas related references
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const flexParent = $("#flexParent");
const controlPanelFlexDiv = $("#controlPanelFlex");
const controlPanelDiv = $("#controlPanel");

var WIDTH;
var HEIGHT;

recalculateDimensions();

const sizeInput = $("#boardSize");
//THESE NEED TO BE SET IN LISTENER
var boardSize = sizeInput[0].value;
var squareSize = WIDTH / boardSize;

var numQueens = 0;
var requiredQueens;

var queenImgWhite;
var queenImgBlack;

var queens = [];

// listen for events
window.addEventListener('resize', myResize);

sizeInput.on('input', function() {
	boardSize = this.value;
	squareSize = WIDTH / boardSize;
	
	queens = [];
	
	draw();
});

$("#placeQueens").click(function() {
	var timeBefore = (new Date()).getTime();
	
	placeQueens();
	
	var timeAfter = (new Date()).getTime();
	
	var timeDifference = timeAfter - timeBefore;
	timeDifference = (timeDifference == 0 ? "<1" : timeDifference);
	
	$("#runTime")[0].innerHTML = timeDifference + "ms";
	
	draw();
});

setupQueenImages();
draw();

function draw() {
	clear();
	
	drawBoard();
	
	drawQueens();
}

function drawBoard() {
	for(var i = 0; i < boardSize; i++) {
		for(var j = 0; j < boardSize; j++) {
			if((i + j) % 2 != 0) {
				ctx.fillRect(squareSize * i, squareSize * j, squareSize, squareSize);
			}
		}
	}
}

function setupQueenImages() {
	queenImgWhite = new Image();
	
	queenImgWhite.src = 'http://www.miapuffia.com/pages/Personal/n-Queens%20Problem/queen.png';
}

function drawQueens() {
	for(var i = 0; i < queens.length; i++) {
		if((queens[i].x + queens[i].y) % 2 == 0) {
			ctx.filter = 'invert(1)';
		} else {
			ctx.filter = 'none';
		}
		
		ctx.drawImage(queenImgWhite, (queens[i].x + 0.13) * squareSize, (queens[i].y + 0.1) * squareSize, queenImgWhite.width / (3500 / (squareSize * 5)), queenImgWhite.height / (3500 / (squareSize * 5)));
	}
	
	ctx.filter = 'none';
}

function placeQueens() {
	queens = [];
	numQueens = 0;
	
	requiredQueens = boardSize;
	
	if(boardSize == 3) {
		requiredQueens = 2;
	} else if(boardSize == 2) {
		requiredQueens = 1;
	}
	
	findQueensRec();
}

function findQueensRec() {
	for(var i = 0; i < boardSize; i++) {
		if(checkForQueens(i, numQueens)) {
			queens.push({
				x: i,
				y: numQueens,
			});
			
			numQueens++;
			
			if(numQueens != requiredQueens) {
				findQueensRec();
			} else {
				return;
			}
		}
	}
	
	if(numQueens != requiredQueens) {
		numQueens--;
		
		queens.pop();
	}
}

function checkForQueens(x, y) {
	if(x == 0 && y == 0) {
		return true;
	}
	
	if(x >= boardSize || y >= boardSize) {
		return false;
	}
	
	for(var i = 0; i < queens.length; i++) {
		if(queens[i].x == x || queens[i].y == y || Math.abs((y - queens[i].y) / (x - queens[i].x)) == 1) {
			return false;
		}
	}
	
	return true;
}

// clear the canvas
function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function myResize(e) {
	recalculateDimensions();
	
	squareSize = WIDTH / boardSize;
	
	draw();
}

function recalculateDimensions() {
	//Horizontal mode
	if(window.innerWidth >= window.innerHeight + controlPanelFlexDiv.outerWidth()) {
		canvas.width = window.innerHeight;
	//Vertical mode
	} else {
		canvas.width = Math.min(window.innerHeight - controlPanelDiv.outerHeight() - 40, window.innerWidth);
	}
	
	canvas.height = canvas.width;

	WIDTH = canvas.width;
	HEIGHT = canvas.height;
}