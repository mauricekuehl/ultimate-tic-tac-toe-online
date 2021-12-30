import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
class Field extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick} className="field">
        {this.props.value}
      </button>
    );
  }
}
class LocalBoard extends React.Component {
  render() {
    return (
      <div className={`local-board ${this.props.className}`}>
        {this.props.localBoard.map((elem, index) => (
          <Field
            key={index}
            value={elem}
            onClick={() => {
              this.props.onClick(index);
            }}
          />
        ))}
      </div>
    );
  }
}

class Board extends React.Component {
  getClassname(index) {
    if (this.props.localBoard[index] !== null) {
      return this.props.localBoard[index] === -1
        ? "inactiveLocalboard"
        : "wonLocalboard";
    } else {
      return this.props.active === index || this.props.active === null
        ? "activeLocalboard"
        : "inactiveLocalboard";
    }
  }

  render() {
    return (
      <div className="main-board">
        {this.props.board.map((elem, index) => {
          return (
            <LocalBoard
              className={this.getClassname(index)}
              active={
                this.props.active === index ||
                (this.props.active === null &&
                  this.props.localBoard[index] === null)
              }
              key={index}
              localBoard={elem}
              onClick={(i) => {
                this.props.onClick(index, i);
              }}
            />
          );
        })}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: Array(9).fill(Array(9).fill(null)),
      localboard: Array(9).fill(null),
      active: null,
      xToMove: true,
    };
  }
  handelClick(boardNum, fieldNum) {
    if (this.state.active === boardNum || this.state.active === null) {
      if (this.state.board[boardNum][fieldNum] === null) {
        // dont know why this is not working:
        //  const b = this.state.board.slice();
        //  b[boardNum][fieldNum] = this.state.xToMove ? "X" : "O";

        // this does the same as above
        const board = this.state.board.slice().map((e, index) => {
          if (index === boardNum) {
            return e.map((f, index) => {
              if (index === fieldNum) {
                return this.state.xToMove ? "X" : "O";
              } else {
                return f;
              }
            });
          } else {
            return e;
          }
        });

        const localboard = this.state.localboard.slice();
        if (this.wonBoard(board[boardNum])) {
          localboard[boardNum] = this.state.xToMove ? "X" : "O";
          board[boardNum] = this.state.xToMove
            ? ["X", null, "X", null, "X", null, "X", null, "X"]
            : ["O", "O", "O", "O", null, "O", "O", "O", "O"];
          if (this.wonBoard(localboard)) {
            this.setState({
              board: board,
              active: -1,
              localboard: Array(9).fill(null),
            });
            console.log("won");
            alert((this.state.xToMove ? "X" : "O") + " won");
            return;
          }
        } else if (!board[boardNum].includes(null)) {
          localboard[boardNum] = -1;
        }

        this.setState({
          board: board,
          active: localboard[fieldNum] === null ? fieldNum : null,
          xToMove: !this.state.xToMove,
          localboard: localboard,
        });
      }
    }
  }
  wonBoard(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return true;
      }
    }
    return false;
  }
  reset() {
    this.setState({
      board: Array(9).fill(Array(9).fill(null)),
      localboard: Array(9).fill(null),
      active: null,
      xToMove: true,
    });
  }
  render() {
    return (
      <>
        <main>
          <h1>Ultimate Tic Tac Toe {this.state.xToMove ? "X" : "O"} to move</h1>

          <button onClick={this.reset.bind(this)}>reset</button>
          <Board
            onClick={this.handelClick.bind(this)}
            board={this.state.board}
            active={this.state.active}
            localBoard={this.state.localboard}
          />
        </main>
        <footer>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/mauricekuehl/ultimate-tic-tak-toe-online"
          >
            View project on Github
          </a>
        </footer>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById("root")
);
