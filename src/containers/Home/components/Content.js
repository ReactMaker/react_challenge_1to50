import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';

@observer
export default class Content extends Component {
  @observable numbers = [];
  @observable time = 0;
  @observable intervalId = null;
  @observable currentNumber = 1;

  componentDidMount() {
    this.createRandomCards();
  }

  @action
  timeStart = () => {
    this.intervalId = setInterval(() => {
      this.time += 1;
    }, 1000);
  }

  getGrid = (number, index) => {
    let text = number;
    let layer = 'layer1';

    // 第一層且該數字被按過了
    if (this.currentNumber <= 25 && this.currentNumber > number) {
      text = this.numbers[1][index];
      layer = 'layer2';
    }

    // 第二層
    if (this.currentNumber > 25 && this.currentNumber > text) {
      text = this.numbers[1][index];
      layer = 'layer2';

      // 該數字被按過了
      if (this.currentNumber > text) {
        text = '';
        layer = 'empty';
      }
    }

    return (
      <div
        key={index}
        className={`btn ${layer}`}
        onClick={() => this.handleClick(text)}
      >
        {text}
      </div>);
  }

  @action
  handleClick = (number) => {
    if (this.currentNumber === number) {
      this.currentNumber += 1;

      // game start
      if (number === 1) {
        this.timeStart();
      }

      // game over
      if (number === 50) {
        window.clearInterval(this.intervalId);
        const time = this.time;
        this.currentNumber = 1;
        this.time = 0;
        this.createRandomCards();
        alert(`花費時間： ${this.showTime(time)}`);
      }
    } else { // 按錯號碼，重來
      this.currentNumber = 1;
      this.createRandomCards();
    }
  }

  showTime = (time) => {
    const minute = String(Math.floor(time / 60)).padStart(2, '00');
    const second = String(Math.floor(time % 60)).padStart(2, '00');

    return `${minute}:${second}`;
  }

  // 打亂順序
  shuffle = (array) => {
    for (let i = array.length; i; i -= 1) {
      const j = Math.floor(Math.random() * i);
      [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }

    return array;
  }

  @action
  createRandomCards = () => {
    const length = 50;
    const tmpArray = Array.from({ length }).map((x, index) => index + 1);

    // 產生隨機1~25  26~50陣列
    this.numbers = [
      [...this.shuffle(tmpArray.slice(0, length / 2))],
      [...this.shuffle(tmpArray.slice(length / 2))],
    ];
  }

  render() {
    return (
      <div className="contentContainer">
        <h2>請按照順序從1點到50，點錯會重頭開始喔！！</h2>
        <div className="content">
          <h3>
            <Badge color="danger">{this.showTime(this.time)}</Badge>
          </h3>
          <div className="zone">
            {
              <div className="board">
                {
                  this.numbers.length &&
                  this.numbers[0].map(this.getGrid)
                }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
