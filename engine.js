const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const frameRate = 1000 / 60;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FLOOR = 80;

const controller = new Controller("KeyW", "KeyD", "KeyS", "KeyA", "Space");
const controller2 = new Controller("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", "Space");

ctx.fillStyle = "black";

entities = [];
particles = [];
backgrounds = [];

RUN = true;

const spritesheet = new Image();
spritesheet.src = "spritesheet.png";

player1 = new Player(new vector2(60, 270), 40, 4, "white", controller);
player1.setCollider();
entities.push(player1);


speed = 6.5;
n = 0;
counter = 0;
/*min. time between cacti spawning */
timingOffset = 90;

score = 0;
/*chance of multiple cacti spawning at once */
chance = 0.2;

gravity = 0.8;


//score
blink = 0;
blinkFrames = 0;
nTimes = 1;
textColor = "white";

ctx.strokeStyle = "white";
ctx.lineWidth = 2;


//scenery
cloudCounter = 0;
rockCounter = 0;
hillCounter = 0;



for (let i = 0; i < 100; i++) {
    rand = Math.random();

    if (rand < 0.4) {
        particles.push(new particle(new vector2(i * 10, HEIGHT - FLOOR + 8), 2, 0.6, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(i * 10, HEIGHT - FLOOR + 20), 2, 1, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(i * 10, HEIGHT - FLOOR + 32), 2, 1.6, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(i * 10, HEIGHT - FLOOR + 48), 2, 2, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(i * 10, HEIGHT - FLOOR + 68), 2, 2.6, "white"));
    }
}





function gameLoop() {
    if (!RUN) {
        return;
    }

    let length = entities.length;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "white"

    ctx.font = "20px Courier New small-caps";

    ctx.drawImage(spritesheet, 0, 120, 1000, 300, 0, 0, WIDTH, HEIGHT);

    //score
    score += 0.03 * speed;

    if (score >= nTimes * 100) {
        nTimes++;
        blinkFrames = 16;
        blink = 4;
    }

    if (blinkFrames > 0) {
        blinkFrames--;
        ctx.fillStyle = textColor;
        ctx.fillText((nTimes - 1) * 100, 950, 50);
    }
    else {
        if (blink > 0) {
            blinkFrames = 16;
            blink--;
            if (textColor == "white") {
                textColor = "black";
            }
            else {
                textColor = "white";
            }
        }
        else {
            ctx.fillText(Math.round(score), 950, 50);
        }
    }






    //entities loop
    for (let i = 0; i < backgrounds.length; i++) {
        backgrounds[i].tick();
        backgrounds[i].render();
    }

    //ground
    ctx.fillStyle = "black";
    ctx.fillRect(0, HEIGHT - FLOOR + 2, WIDTH, 400);

    ctx.fillStyle = "white"
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT - FLOOR);
    ctx.lineTo(1000, HEIGHT - FLOOR);
    ctx.stroke();



    for (let i = 0; i < length; i++) {
        entities[i].tick();
        entities[i].render();

    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].tick();
        particles[i].render();
    }




    /**particles */

    rand = Math.random();

    if (rand < 0.4) {
        particles.push(new particle(new vector2(1000, HEIGHT - FLOOR + 8), 2, 0.6, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(1000, HEIGHT - FLOOR + 20), 2, 1, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(1000, HEIGHT - FLOOR + 32), 2, 1.6, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(1000, HEIGHT - FLOOR + 48), 2, 2, "white"));
    }
    if (rand < 0.4) {
        particles.push(new particle(new vector2(1000, HEIGHT - FLOOR + 68), 2, 2.6, "white"));
    }



    while (particles.length > 350) {
        particles.shift();
    }


    //backgrounds
    if (cloudCounter > 0) {
        cloudCounter--;
    }
    else {
        backgrounds.push(new cloud(new vector2(1000, 150 + Math.random() * 30), 2, 0.5, 5))
        cloudCounter = 50 + Math.random() * 200;
    }

    if (rockCounter > 0) {
        rockCounter--;
    }
    else {
        backgrounds.push(new background(new vector2(1000, HEIGHT - FLOOR - 4), 1, 0, 7))
        rockCounter = 10 + Math.random() * 90;
    }

    if (hillCounter > 0) {
        hillCounter--;
    }
    else {
        backgrounds.push(new background(new vector2(1000, HEIGHT - FLOOR - 40 + Math.random() * 10), 3, (1 + Math.random()) - speed, 2))
        hillCounter = 10 + Math.random() * 45;
    }



    //counters
    if (counter > 0) {
        counter--;
    }
    else {
        counter = (Math.random() * 20) + timingOffset;

        c = new cactus(new vector2(1000, HEIGHT - FLOOR - 39), 40, speed, "grey");
        c.setCollider();
        entities.push(c);

        if (Math.random() < chance) {
            c = new cactus(new vector2(1045, HEIGHT - FLOOR - 39), 40, speed, "grey");
            c.setCollider();
            entities.push(c);
			
			counter += 2;

            if (Math.random() < chance - 0.1 && speed > 9) {
                c = new cactus(new vector2(1090, HEIGHT - FLOOR - 39), 40, speed, "grey");
                c.setCollider();
                entities.push(c);

                counter += 4;
            }
        }



        if (timingOffset > 15) {
            timingOffset--;
        }
        if (speed < 19) {
            if (n > 0) {
                n--;
            }
            else {
                speed += 0.5;
                n = 4;
            }
        }

        if (chance < 0.8) {
            chance += 0.05;
        }
    }
}

setInterval(gameLoop, frameRate);

function saveScore() {
if (document.getElementById("nome").value != "") {
        text = document.getElementById("nome").value.substring(0, 14) + "|" + Math.round(score) + ";";
        
        if (localStorage.getItem("highscore") != null) {
            text += localStorage.getItem("highscore");
        }
        localStorage.setItem("highscore", text);
        location.assign("index.html");
    }
}


function loadScore()
{
    if (localStorage.getItem("highscore") == null) {
        return;
    }

    scores = localStorage.getItem("highscore").split(";");
    sorted = [];

    for (let i = 0; i < scores.length; i++) {
        index = scores[i].indexOf("|");
        sorted.push({
            name: scores[i].substring(0, index),
            score: scores[i].substring(index + 1)
        });
    }

    sorted.sort((a, b) => b.score - a.score);

    for (let i = 0; i < sorted.length - 1; i++) {
        const div = document.createElement("div");
        div.classList = "row";
        document.getElementById("leaderboard").appendChild(div);

        const entryName = document.createElement("h3");
        entryName.innerHTML = sorted[i].name;
        div.appendChild(entryName);

        
        const entryScore = document.createElement("h3");
        entryScore.innerHTML = sorted[i].score;
        div.appendChild(entryScore);
    }
}

loadScore();