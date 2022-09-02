const LEFT = "ArrowLeft";
const RIGHT = "ArrowRight";
const UP = "ArrowUp";
const DOWN = "ArrowDown";
let step = -20;

const canvas = document.querySelector(".canvas");

const boxSize = 480;

let moveBreaker;

const score = document.createElement("h1");
score.record = 0;
score.textContent = "Score: " + score.record;
canvas.append(score);


class Unit {
  constructor(x, y) {
    this.body = document.createElement("div");
    this.body.className = "unit";
    this.style = this.body.style;
    this.setCoords(x, y);
    this.dir = LEFT;
    canvas.append(this.body);
  }

  setCoords(newX, newY) {
    this.coords = [newX, newY];
    this.style.left = newX + "px";
    this.style.top = newY + "px";
  }
}

function randomCoors() {
  return 20 * Math.round(Math.random() * 24);
}

function setFood() {
  let target = new Unit(randomCoors(), randomCoors());
  target.style.backgroundColor = "#e00";
  return target;
}

let food = setFood();

class Snake {
  constructor() {
    this.head = new Unit(boxSize / 2, boxSize / 2);
    this.head.body.style.backgroundColor = "#b2d119";
    this.units = [this.head];
    this.length = 1;
    this.speed = 100;
    this.break = false;
    moveBreaker = this.initialMove();
    this.playerMove();
  }

  initialMove = () => {
    return setInterval(() => {
      this.head.dir = LEFT;
      this.moveThroughX();
    }, this.speed);
  };

  move(){
    let nextPosition, prevPosition;
    this.units.forEach((unit, index, array) => {
      prevPosition = [unit.coords[0], unit.coords[1]];
      if (index > 0) {
        unit.setCoords(nextPosition[0], nextPosition[1])
        unit.dir = array[index - 1].dir;
      }
      nextPosition = [prevPosition[0], prevPosition[1]];
    })
  }

  moveThroughX() {
    this.move();
    if (this.head.coords[0] > 0) {
      this.head.setCoords(this.head.coords[0] + step, this.head.coords[1]);
    } else if (this.head.coords[0] <= 0) {
      if (step < 0) {
        this.head.setCoords(boxSize, this.head.coords[1]);
      } else {
        this.head.setCoords(this.head.coords[0] + step, this.head.coords[1]);
      }
    }
    if (this.head.coords[0] > boxSize) {
      if (step > 0) {
        this.head.setCoords(0, this.head.coords[1]);
      }
    }
    this.scoreUpdate(this.speed, this.collision());
  }

  moveThroughY() {
    this.move();
    if (this.head.coords[1] > 0) {
      this.head.setCoords(this.head.coords[0], this.head.coords[1] + step);
    } else if (this.head.coords[1] <= 0) {
      if (step < 0) {
        this.head.setCoords(this.head.coords[0], boxSize);
      } else {
        this.head.setCoords(this.head.coords[0], this.head.coords[1] + step);
      }
    }
    if (this.head.coords[1] > boxSize) {
      if (step > 0) {
        this.head.setCoords(this.head.coords[0], 0);
      }
    }
    this.scoreUpdate(this.speed, this.collision());
  }

  playerMove() {
    document.addEventListener("keydown", (event) => {
      const directions = [LEFT, RIGHT, UP, DOWN];
      if (directions.includes(event.code)) {
        this.setDirection(event.code);
      }
    });
  }

  setDirection(direction) {
    clearInterval(moveBreaker);
    moveBreaker = setInterval(() => {
      this.head.dir = direction;
      step = direction === LEFT || direction === UP ? -20 : 20;
      if (direction === LEFT || direction === RIGHT) {
        this.moveThroughX();
      } else {
        this.moveThroughY();
      }
    }, this.speed);
  }

  collision() {
    if (
      this.head.coords[0] === food.coords[0] &&
      this.head.coords[1] === food.coords[1]
    ) {
      this.length++;
      this.speedUpdate();
      food.body.parentElement.removeChild(food.body);
      this.advance(this.units[this.units.length - 1].dir);
      food = setFood();
      return 50;
    }
  }

  advance(direction) {
    let x, y;
    if (this.units[this.units.length - 1].dir == LEFT || this.units[this.units.length - 1].dir == RIGHT) {
      x = this.units[this.units.length - 1].coords[0] - step;
      y = this.units[this.units.length - 1].coords[1];
    }
    else {
      x = this.units[this.units.length - 1].coords[0];
      y = this.units[this.units.length - 1].coords[1] - step;
    }
    this.units.push(new Unit(x, y));
    this.units[this.units.length - 1].dir = direction;
  }
  scoreUpdate(speed, food) {
    score.record += Math.trunc(100 / speed);
    if (food) {
      score.record += food;
    }
    score.textContent = "Score: " + score.record;
  }
  speedUpdate() {
    if (this.length % 8 == 0) {
      this.speed /= 1.15;
    }
  }
}
new Snake();
