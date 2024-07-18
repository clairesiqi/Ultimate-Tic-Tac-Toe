////------------------------ Defining Constants ------------------------ ////

const winningCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const crossSound = new Audio("sounds/cross.mp3");
const circleSound = new Audio("sounds/circle.mp3");
const win1Sound = new Audio("sounds/won1.wav");
const startSound = new Audio("sounds/start-game.wav");
const undoSound = new Audio("sounds/Oops.mp3");
const win2Sound = new Audio("sounds/applause.wav");
let bgSound = new Audio("sounds/Fluffing-a-Duck.mp3");
bgSound.loop = true;

////------------------------ Defining Overall Variables ------------------------ ////

let boardClicked, cellClicked, cellLocation;
let playedMoves = [];
let numberPlayed,
  allSubGames,
  playedListOfHTMLSnaps0 = [],
  playedListOfHTMLSnaps1 = [],
  playedListOfHTMLSnaps2 = [],
  playedListOfHTMLSnaps3 = [],
  playedListOfHTMLSnaps4 = [],
  playedListOfHTMLSnaps5 = [],
  playedListOfHTMLSnaps6 = [],
  playedListOfHTMLSnaps7 = [],
  playedListOfHTMLSnaps8 = [];
let playedListOfHTMLSnaps = [
  playedListOfHTMLSnaps0,
  playedListOfHTMLSnaps1,
  playedListOfHTMLSnaps2,
  playedListOfHTMLSnaps3,
  playedListOfHTMLSnaps4,
  playedListOfHTMLSnaps5,
  playedListOfHTMLSnaps6,
  playedListOfHTMLSnaps7,
  playedListOfHTMLSnaps8,
];
let mainBoardHTMLSnaps = [];
let bgSoundPlay = 0;

////------------------------ Silence Button ------------------------ ////

$(".turn-off-music").click(function () {
  if (bgSoundPlay % 2 === 0) {
    bgSound.pause();
  } else {
    bgSound.play();
  }
  bgSoundPlay++;
});

////------------------------ Start Game Button ------------------------ ////

$(".start-game-button").click(function () {
  startSound.play();
  $(".start-game-button").attr("id", "start-pressed");
  setTimeout(function () {
    $(".start-game-button").attr("id", "");
  }, 100);

  startNewGame();
});

////------------------------ Undo Button ------------------------ ////

$(".undo-button").click(function () {
  undoSound.play();
  if (playedMoves === undefined) {
  } else {
    $(".undo-button").addClass("pressed");
    setTimeout(function () {
      $(".undo-button").removeClass("pressed");
    }, 100);

    if ($(".main-board").html().length < 100) {
      $(".main-board").html(
        `${mainBoardHTMLSnaps[mainBoardHTMLSnaps.length - 2]}`
      );
      mainBoardHTMLSnaps.pop();

      // REINITIALISE ALL SUBGAMES AND ADD EVENT LISTENERS
      for (let i = 0; i < allSubGames.length; i++) {
        allSubGames[i] = new Game(i, "cell");
      }
      allSubGames.forEach((element) => {
        element.allCells.click(function () {
          boardClicked = $(this).parent().attr("class").slice(6);
          cellClicked = $(this).attr("class").slice(5);
          cellLocation = [boardClicked, cellClicked];
          playedMoves.push(cellLocation);

          if ($(this).text() != "") {
          } else {
            numberPlayed++;
            if (numberPlayed % 2 === 0 && $(this).text() === "") {
              $(this).css("color", "#FF5151");
              $(this).text("X");
              crossSound.play();
              element.playedList.push("X");
            } else if (numberPlayed % 2 === 1 && $(this).text() === "") {
              $(this).css("color", "#88E0EF");
              $(this).text("O");

              circleSound.play();
              element.playedList.push("O");
            }

            playedListOfHTMLSnaps[
              parseInt(playedMoves[playedMoves.length - 1][0][6])
            ].push(element.gameBoard.html());
            mainBoardHTMLSnaps.push($(".main-board").html());
          }
          element.checkWin();
        });
      });
    } else if (
      $(`.${playedMoves[playedMoves.length - 1][0]}`).html().length < 50
    ) {
      $(`.${playedMoves[playedMoves.length - 1][0]}`).html(
        `${
          playedListOfHTMLSnaps[
            parseInt(playedMoves[playedMoves.length - 1][0][6])
          ][
            playedListOfHTMLSnaps[
              parseInt(playedMoves[playedMoves.length - 1][0][6])
            ].length - 2
          ]
        }`
      );

      playedListOfHTMLSnaps[
        parseInt(playedMoves[playedMoves.length - 1][0][6])
      ].pop();
      allSubGames[
        parseInt(playedMoves[playedMoves.length - 1][0][6])
      ].gameBoard.removeClass("board-complete");

      // Initialise new subGame
      allSubGames[parseInt(playedMoves[playedMoves.length - 1][0][6])] =
        new Game(parseInt(playedMoves[playedMoves.length - 1][0][6]), "cell");
      allSubGames[
        parseInt(playedMoves[playedMoves.length - 1][0][6])
      ].allCells.click(function () {
        boardClicked = $(this).parent().attr("class").slice(6);
        cellClicked = $(this).attr("class").slice(5);
        cellLocation = [boardClicked, cellClicked];
        playedMoves.push(cellLocation);

        if ($(this).text() != "") {
        } else {
          numberPlayed++;
          if (numberPlayed % 2 === 0 && $(this).text() === "") {
            $(this).css("color", "#FF5151");
            $(this).text("X");
            crossSound.play();
          } else if (numberPlayed % 2 === 1 && $(this).text() === "") {
            $(this).css("color", "#88E0EF");
            $(this).text("O");

            circleSound.play();
          }

          playedListOfHTMLSnaps[
            parseInt(playedMoves[playedMoves.length - 1][0][6])
          ].push(
            allSubGames[
              parseInt(playedMoves[playedMoves.length - 1][0][6])
            ].gameBoard.html()
          );
        }
        allSubGames[
          parseInt(playedMoves[playedMoves.length - 1][0][6])
        ].checkWin();
      });
    } else {
      $(
        `.${playedMoves[playedMoves.length - 1][0]} .${
          playedMoves[playedMoves.length - 1][1]
        }`
      ).text("");
    }

    playedMoves.pop();
    numberPlayed++;
  }
});

////------------------------ Creating Game Class ------------------------ ////

class Game {
  constructor(Id, container) {
    this.gameBoard = $(`#board-${Id}`);
    this.allCells = $(`#board-${Id} .${container}`);
    this.cell0 = $(`#board-${Id}  .${container}-0`);
    this.cell1 = $(`#board-${Id}  .${container}-1`);
    this.cell2 = $(`#board-${Id}  .${container}-2`);
    this.cell3 = $(`#board-${Id}  .${container}-3`);
    this.cell4 = $(`#board-${Id}  .${container}-4`);
    this.cell5 = $(`#board-${Id}  .${container}-5`);
    this.cell6 = $(`#board-${Id}  .${container}-6`);
    this.cell7 = $(`#board-${Id}  .${container}-7`);
    this.cell8 = $(`#board-${Id}  .${container}-8`);
    this.playedList = [];
  }

  // Replace board cell with winning side
  mainBoardShowAndCheck(winningPlayer) {
    win1Sound.play();
    this.gameBoard.html(`<div class="winningPlayer">${winningPlayer}</div>`);
    this.gameBoard.addClass("board-complete");

    // Check Main Board
    let mainGameCurrent = document.querySelectorAll(".main-board .board");
    let ultimateWinningPlayer;
    let ultimateWin = false;

    for (let i = 0; i < 8; i++) {
      let xU = mainGameCurrent[winningCondition[i][0]].innerHTML;
      let yU = mainGameCurrent[winningCondition[i][1]].innerHTML;
      let zU = mainGameCurrent[winningCondition[i][2]].innerHTML;

      if (xU.length > 50 || yU.length > 50 || zU.length > 50) {
        continue;
      }
      if (xU === yU && yU === zU) {
        ultimateWin = true;
        ultimateWinningPlayer = xU[27];
        break;
      }
    }
    if (ultimateWin === true) {
      // setTimeOut(() => showUltimateWin(winningPlayer), 500);
      win2Sound.play();
      $("#board-main").html(
        `<div id="ultimate-winning-player">${ultimateWinningPlayer}</div>`
      );
      setTimeout(function () {
        $("#ultimate-winning-player").css("opacity", "1");
      }, 300);

      if (ultimateWinningPlayer === "X") {
        $("#ultimate-winning-player").css("margin-left", "150px");
      }
    }
  }

  // Check for a win with index matching
  checkWin() {
    let win = false;
    let winningPlayer;
    let currentGame = [
      this.cell0.text(),
      this.cell1.text(),
      this.cell2.text(),
      this.cell3.text(),
      this.cell4.text(),
      this.cell5.text(),
      this.cell6.text(),
      this.cell7.text(),
      this.cell8.text(),
    ];

    for (let i = 0; i < 8; i++) {
      let x = currentGame[winningCondition[i][0]];
      let y = currentGame[winningCondition[i][1]];
      let z = currentGame[winningCondition[i][2]];

      if (x === "" || y === "" || z === "") {
        continue;
      }
      if (x === y && y === z) {
        win = true;
        winningPlayer = x;
        break;
      }
    }

    if (win === true) {
      setTimeout(() => this.mainBoardShowAndCheck(winningPlayer), 400);
    }
  }
}

// Start new game function

function startNewGame() {
  bgSound.play();
  $("#board-main").html(`<div class="board board-0" id="board-0">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-1" id="board-1">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-2" id="board-2">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-3" id="board-3">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-4" id="board-4">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-5" id="board-5">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-6" id="board-6">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-7" id="board-7">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>

        <div class="board board-8" id="board-8">
          <div class="cell cell-0"></div>
          <div class="cell cell-1"></div>
          <div class="cell cell-2"></div>
          <div class="cell cell-3"></div>
          <div class="cell cell-4"></div>
          <div class="cell cell-5"></div>
          <div class="cell cell-6"></div>
          <div class="cell cell-7"></div>
          <div class="cell cell-8"></div>
        </div>`);
  let game0 = new Game(0, "cell");
  let game1 = new Game(1, "cell");
  let game2 = new Game(2, "cell");
  let game3 = new Game(3, "cell");
  let game4 = new Game(4, "cell");
  let game5 = new Game(5, "cell");
  let game6 = new Game(6, "cell");
  let game7 = new Game(7, "cell");
  let game8 = new Game(8, "cell");

  allSubGames = [game0, game1, game2, game3, game4, game5, game6, game7, game8];

  // Adding event listeners to cell units
  numberPlayed = -1;

  allSubGames.forEach((element) => {
    element.allCells.click(function () {
      boardClicked = $(this).parent().attr("class").slice(6);
      cellClicked = $(this).attr("class").slice(5);
      cellLocation = [boardClicked, cellClicked];
      playedMoves.push(cellLocation);

      if ($(this).text() != "") {
      } else {
        numberPlayed++;
        if (numberPlayed % 2 === 0 && $(this).text() === "") {
          $(this).css("color", "#FF5151");
          $(this).text("X");
          crossSound.play();
          element.playedList.push("X");
        } else if (numberPlayed % 2 === 1 && $(this).text() === "") {
          $(this).css("color", "#88E0EF");
          $(this).text("O");

          circleSound.play();
          element.playedList.push("O");
        }

        playedListOfHTMLSnaps[
          parseInt(playedMoves[playedMoves.length - 1][0][6])
        ].push(element.gameBoard.html());
        mainBoardHTMLSnaps.push($(".main-board").html());
        // alert(element.playedListOfHTMLSnaps);
      }
      element.checkWin();
    });
  });
}
