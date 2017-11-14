import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var row = new Array(6).fill(null, true);
var col = new Array(6).fill(null, true);

var moves = [];
var position = -1;
function Square(props) {
    let classname = "square";
    if (props.isHighlight === 'true') {
        classname = "square-highlight"
    }
    return (
        <button className={classname} id={props.position} onClick={props.onClick}>
            {props.value}
        </button>
    );
}


class Board extends React.Component {

    renderSquare(i, isHighlight) {
        // console.log(isHighlight)
        return (
            <Square
                isHighlight={isHighlight}
                position={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
    }

    renderRow(i, isHighlight){
        return row.map((data, index) => 
            this.renderSquare(i*5 + index - 1, isHighlight[i*5 + index - 1]
            ))
    }
    render() {
        let isHighlight = this.props.isHighlight;
        return (
            col.map((data, index) => (
                <div className="board-row">
                    {this.renderRow(index - 1, this.props.isHighlight)}
                </div>
            ))
        );
    }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = ({
            history:[
                {
                    squares: Array(25).fill(null, false)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        })
    }

    handleClick(i) {
        position = i;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        // console.log(squares)
        this.setState({
          history: history.concat([
            {
              squares: squares
            }
          ]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext
        });
        
        let item = <li> row:{Math.round(position / 5) + 1} col:{position%5+1} </li>
        moves = moves.concat(item)
    }

    handleReplay() {
        this.setState({
            history:[
                {
                    squares: Array(25).fill(null, true)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        })
        moves = [];
        
    }

    handleMoveClick(e){
        console.log(e.target.parentNode.childNodes)
        e.target.parentElement.childNodes.forEach(element => {
            element.style.fontWeight = "normal"
        });
        e.target.style.fontWeight = "bolder"
    }

    render() {
        const history = this.state.history;
        console.log(position)
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let isHighlight = Array(25).fill(false)
        let replay = false;

        let status;
        if (winner) {
            for (let i = 0; i < 5; i++) {
                isHighlight[winner.line[i]] = "true"
            }
            status = 'Winner: ' + winner.square;
            replay = <button onClick={() => this.handleReplay()}>replay</button>;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        isHighlight = {isHighlight}
                        squares = {current.squares}
                        onClick = {i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info" onClick = { e => this.handleMoveClick(e)}>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    {/* replay */}
                    <div onClick={() => this.handleReplay()}>{replay}</div>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
            return {
                square: squares[a],
                line: lines[i]
            };
        }
    }
    return null;
}