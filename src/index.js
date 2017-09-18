import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const ROWS = [];
    let ROW = [];
    const SIZE = this.props.size;
    for(let i = 0; i < SIZE; i++) {
      for(let j = 0; j < SIZE; j++) {
        let k = i * SIZE + j;
        ROW[k] = this.renderSquare(k);
      }
      ROWS.push(<div key={i} className="board-row">{ROW}</div>);
      ROW = [];
    }

    return <div>{ROWS}</div>;
  }
}

class GameInfo extends React.Component {
  render() {
    const moves = this.props.history.map((step, move) => {
      const desc = move ? "Move #" + move : "Game Start";
      const descBold = this.props.stepNumber === move ? (<b>{desc}</b>) : desc;
      return (
        <li key={move}>
          ({this.props.location[move].x}, {this.props.location[move].y})
          <a href="#" onClick={() => this.props.onJumpTo(move)}>{descBold}</a>
        </li>
      );
    });

    return (
      <div>
        <div className="status">{this.props.status}</div>
        <ol>{moves}</ol>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      location: [{
        x: 0,
        y: 0,
      }],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleJumpTo = this.handleJumpTo.bind(this);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            size={3}
          />
        </div>
        <div className="game-info">
          <GameInfo
            history={this.state.history}
            stepNumber={this.state.stepNumber}
            location={this.state.location}
            onJumpTo={(step) => this.handleJumpTo(step)}
            status={status}
          />
        </div>
      </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const location = this.state.location.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    } else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      let newLocation = getLocation(i);
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        location: location.concat([
          newLocation
        ])
      });
    }
  }

  handleJumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0 ? true : false,
    });
  }

}

function getLocation(i) {
  const location = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 1],
    [2, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
  ];
  return ({x: location[i][0], y: location[i][1]});
}

function calculateWinner(squares) {
  const line = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < line.length; i++) {
    const [a, b, c] = line[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  