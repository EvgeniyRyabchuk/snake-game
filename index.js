


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BodyParts = {
    head: {
        content: "O",
        bgColor: "green",
        x: 0,
        y: 0,
        className: "head"
    },
    tail: {
        content: "o",
        bgColor: "brown",
        x: 0,
        y: 0,
        className: "tail"
    }
}

const FoodList = {
    apple: {
        name: "apple",
        content: "a",
        className: "apple",
        bonus: 1,
    },
    orange: {
        name: "orange",
        content: "o",
        className: "orange" ,
        bonus: 2, 
    }
}
const fieldSign = "0"; 

class Food {
    x; 
    y;
    constructor(type, x, y) {
        this.type = type;
        this.y = y ?? 0;
        this.x = x ?? 0; 
    }
}



class Snake {
    constructor() {
        this.body = [
            {...BodyParts.head, x: 3}, 
            {...BodyParts.tail, x: 2}, 
            {...BodyParts.tail, x: 1}, 
            {...BodyParts.tail, x: 0},  
        ];
    }
}


const defaultSpeed = 300; 
const speedBooster = 50; 
const speedLimit = 100; 

const defMinFoodCount = 10;
const defMaxFoodCount = 20; 

const getMinutesFormat = (timer) => {
    const totalSeconds = Math.max(0, Math.ceil(timer / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes).padStart(1, '0') + ':' + String(seconds).padStart(2, '0');
}

// Форматируем как x:xx
const getSpeedFormat = (speed) => {
    return `x${speed.toFixed(2)}`
}

class Game {
    field;
    snake;
    direction;
    invervalId;
    size; 
    headHistory; 
    food;
    loseMessage = document.getElementById("loseMessage"); 
    score;
    eatenCount; 
    speed;
    timer; 
    board;
    
    constructor(speed = defaultSpeed, fieldSize, filedContainer, board) {
        this.size = fieldSize; 
        this.filedContainer = filedContainer; 
        this.board = board; 
        this.reset();   
        this.speed = speed;
     
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            // console.log(1);
            
            switch (event.code) {
                case 'ArrowUp':
                    this.direction = {
                        x: 0,
                        y: -1
                    };
                    // console.log('Move ArrowUp');
                    break;
                case 'ArrowLeft':
                    //   console.log('Move ArrowLeft');
                    this.direction = {
                        y: 0,
                        x: -1
                    };
                    break;
                case 'ArrowDown':
                    // console.log('Move ArrowDown');
                    this.direction = {
                        x: 0,
                        y: 1
                    };
                    break;
                case 'ArrowRight':
                    // console.log('Move ArrowRight');
                    this.direction = {
                        y: 0,
                        x: 1
                    };
                    break;
                case 'Enter':
                       game.stop();
                       loseMessage.classList.remove("is-open");
                       game.start(); 
                break;
            }
        });
    }

    generateRandomFood(min, max) {
        const randCount = getRandomInt(min, max);
        for(let i = 0; i < randCount; i++) {
            const randPosition = { x: getRandomInt(0, this.size[1] - 1), y: getRandomInt(0, this.size[0] - 1) }
            const randKey = Object.keys(FoodList)[getRandomInt(0, Object.keys(FoodList).length - 1)]; 
            const randFoodType = FoodList[randKey]; 
            const food = new Food(randFoodType, randPosition.x, randPosition.y);
            this.food.push(food);
        }
    }

    draw() {
        // clear filed 
        for(let y = 0; y < this.size[0]; y++) {
            this.field[y] = Array(this.size[1]).fill(fieldSign); 
        }
        // change snake position on filed and recreate filed  
        let text = ""; 
        let tailIndex = 0;
        for(let part of this.snake.body) {

            if(part.className === BodyParts.head.className) {
                // cut the tail
                if(this.headHistory.length >= this.snake.body.length - 1) {
                    this.headHistory.shift(); 
                }

                this.headHistory.push({x: part.x, y: part.y});
                
                // check if snake heat yourself at the "neck" 
                // to prevent case when user press opposite dirrection by x or y that can trigger lose 
                if(part.x + this.direction.x === this.snake.body[1].x && 
                    part.y + this.direction.y === this.snake.body[1].y) { 
                        console.log("can't move like that. there were the neck"); 
                        this.direction.x = -this.direction.x;
                        this.direction.y = -this.direction.y;

                }
           
                part.x += this.direction.x;
                part.y += this.direction.y; 

                // console.log(`snake pos: ${part.x}, ${part.y}`);
                // console.log(this.food.map(f => `food pos: ${f.x} | ${f.y}` ));

                // check if snake is found meal 
                for(let i = 0; i < this.food.length; i++) { 
                    const f = this.food[i]; 
                    if(part.x === f.x && part.y === f.y) { 
                        // generate tails for grow related of food bonus boost  
                        const bonusGrownTails = new Array(f.type.bonus).fill({...BodyParts.tail});
                        const firstHeadHistory = this.headHistory[0];
                        const lastCurrentTail = this.snake.body[this.snake.body.length - 1];
                   
                        // console.log("x", firstHeadHistory.x, lastCurrentTail.x);
                        // console.log("y", firstHeadHistory.y, lastCurrentTail.y);
                        bonusGrownTails.forEach((tail, index) => {
                            // find move vector of last tail in history to define where should be added tail 
                            if(firstHeadHistory.x > lastCurrentTail.x) {
                                tail.x = firstHeadHistory.x - 1; 
                                tail.y = firstHeadHistory.y;
                            }
                            if(firstHeadHistory.x < lastCurrentTail.x) {
                                tail.x = firstHeadHistory.x + 1; 
                                tail.y = firstHeadHistory.y;
                            }
                            if(firstHeadHistory.y > lastCurrentTail.y) {
                                tail.y = firstHeadHistory.y - 1;
                                tail.x = firstHeadHistory.x;
                            }
                            if(firstHeadHistory.y < lastCurrentTail.y) {
                                tail.y = firstHeadHistory.y + 1; 
                                tail.x = firstHeadHistory.x;
                            }
                            this.headHistory.unshift({x: tail.x, y: tail.y})
                            this.snake.body.push(tail);
                        })
                        // TODO: remake 
                        this.food.splice(i, 1);  
                        this.score += f.type.bonus * 100; 

                        this.eatenCount++;
                        this.board.scoreSpan.innerText = this.score; 
                        this.board.eatenSpan.innerText = this.eatenCount; 
                        
                        // check if speed in limit contriction if ok then speed up 
                        if(this.speed - (f.type.bonus * speedBooster) >= speedLimit) {
                            this.speed = this.speed - (f.type.bonus * speedBooster); 
                            this.stop(); 
                            this.startWithoutReset();
                            this.board.speedSpan.innerText = getSpeedFormat(defaultSpeed / this.speed); 
                            console.log(this.speed);
                        }

                        console.log(`now food lefted ${this.food.length}`);
                        
                        if(this.food.length === 0) {
                            this.generateRandomFood(defMinFoodCount, defMaxFoodCount); 
                        }
                    }
                
                }
            }

            // TODO: collision happenign not always  
            // check if collision is occurred 
            const head = this.snake.body.find(p => p.className === "head");
            for(let p of this.snake.body) {
                if(p.className === "tail" && p.x === head.x && p.y === head.y) {
                    this.stop();
                    loseMessage.classList.toggle("is-open");
                    return;
                }
            }
            
            if(part.className === BodyParts.tail.className) {
                const i = (this.headHistory.length - 1) - tailIndex; 
                part.x = this.headHistory[i].x; 
                part.y = this.headHistory[i].y; 
                tailIndex++;
            }

            if(part.x >= this.size[1]) 
                part.x = 0;
            if(part.x < 0) 
                part.x = this.size[1] - 1;

            if(part.y >= this.size[0]) 
                part.y = 0; 
            if(part.y < 0) 
                part.y = this.size[0] - 1; 

            this.field[part.y][part.x] = 
            `<span class="${part.className}">${part.content}</span>`;
           
        }

  
 
        // draw new field 
        for(let y = 0; y < this.size[0]; y++) {
            for(let x = 0; x < this.size[1]; x++) {

                // if this is food then draw as food 
                const foodToDraw = this.food.find(f => f.x === x && f.y === y); 
                if(foodToDraw) {
                    text += `<span class="${foodToDraw.type.className}">${foodToDraw.type.content}</span>`;  
                } else {
                    // else drow this as part of snake  
                    text += this.field[y][x]; 
                }
            }
            text += "<br />";
        }
        this.filedContainer.innerHTML = text; 
    }

    start () {
        this.reset(); 
        this.invervalId = setInterval(() => {
            this.draw();
            this.timer += this.speed;  
            this.board.timerSpan.innerText = getMinutesFormat(this.timer); 
        }, this.speed)
    }

    startWithoutReset() {
        this.invervalId = setInterval(() => {
            this.draw(); 
             this.timer += this.speed;  
            this.board.timerSpan.innerText = getMinutesFormat(this.timer); 
        }, this.speed)
    }

    stop () {
        clearInterval(this.invervalId);
    }

    reset() {
        this.field = []; 
        this.food = []; 
        this.score = 0;
        this.eatenCount = 0;
        this.speed = defaultSpeed; 
        this.timer = 0; 


        this.board.scoreSpan.innerText = "0000";
        this.board.eatenSpan.innerText = "0";
        this.board.timerSpan.innerText = "0:00";
        this.board.speedSpan.innerText = "x1"; 
        
        this.headHistory = [
            {x: 0, y: 0},
            {x: 1, y: 0}, 
            {x: 2, y: 0}
        ];
        this.direction = {
            x: 1,
            y: 0
        };
        this.snake = new Snake(); 

        for(let y = 0; y < this.size[0]; y++) {
            this.field.push(Array(this.size[1]).fill("0")); 
        }

        this.generateRandomFood(defMinFoodCount, defMaxFoodCount); 
    }
}

const field = document.getElementById("field"); 
const restartBtn = document.getElementById("restart");
const scoreSpan = document.getElementById('scoreSpan');
const eatenSpan = document.getElementById("eatenSpan");
const timerSpan = document.getElementById("timerSpan"); 
const speedSpan = document.getElementById("speedSpan"); 
const alertElem = document.querySelector(".alert");

const speedInterval = 200;
// [vertical size, horizontal size] 
const filedSize = {
    desktop: [20, 20],
    mobile: [10, 10] 
}


const game = new Game(speedInterval, filedSize.desktop, field, {  
    scoreSpan,
    eatenSpan,
    timerSpan,
    speedSpan 
}); 

game.start(); 

restartBtn.addEventListener("click", () => {
    game.stop();
    loseMessage.classList.remove("is-open");
    game.start(); 
})





function checkIsMobile() {
    const mobileBreakpoint = 800; 
    const isMobile = window.innerWidth < mobileBreakpoint;

    if(isMobile) {
        alertElem.style.display = "block"; 
        // setTimeout(() => game.stop() , 100)
        game.stop();
    } else {
        alertElem.style.display = "none"; 
        game.stop();
         game.start();
    }
}
window.addEventListener("resize", () => {
    checkIsMobile();
})