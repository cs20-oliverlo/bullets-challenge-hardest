// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 550;

// EVENT STUFF
let mouseIsPressed = false;
let mouseX;
let mouseY;

document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);  


function mousemoveHandler(e) {
    // Get rectangle info about canvas location
    let cnvRect = cnv.getBoundingClientRect();
  
    // Calc mouse coordinates using mouse event and canvas location info
    mouseX = Math.round(e.clientX - cnvRect.left);
    mouseY = Math.round(e.clientY - cnvRect.top);
}

function mousedownHandler() {
    mouseIsPressed = true;
}

function mouseupHandler() {
    mouseIsPressed = false;
}

function keydownHandler(event) {
    if (event.code === "KeyW") {
        player[0].up = true;
    }
    if (event.code === "KeyA") {
        player[0].left = true;
    }
    if (event.code === "KeyD") {
        player[0].right = true;
    }
    if (event.code === "KeyS") {
        player[0].down = true;
    }
}
  
function keyupHandler(event) {
    if (event.code === "KeyW") {
        player[0].up = false;
    }
    if (event.code === "KeyA") {
        player[0].left = false;
    }
    if (event.code === "KeyD") {
        player[0].right = false;
    }
    if (event.code === "KeyS") {
        player[0].down = false;
    }
}

// Global Variables
let canvasMidWidth = cnv.width / 2;
let canvasMidHeight = cnv.height / 2;

// Reset Variables
let circles;
let circleSpawnTimer = 0;
let player;
let bullets;
let bulletReload = 15;

reset();


// Animation
requestAnimationFrame(animate);
function animate() {
    // Fill Background
    ctx.fillStyle = `rgb(50, 50, 50)`;
    ctx.fillRect(0, 0, cnv.width, cnv. height);

    // Food Helper Functions
    for (let i = 0; i < circles.length; i++) {
        drawCircles(circles, i);
        moveCircles(i);
    }
    spontaneousGeneration();

    // Player Helper Functions
    drawCircles(player, 0);
    playerControls();

    // Bullet Helper Functions
    for (let i = 0; i < bullets.length; i++) {
        drawCircles(bullets, i);
        bulletMovement(i);
        bulletDetection(i);
    }

    // Request Animation Frame
    requestAnimationFrame(animate);
}

function drawCircles(shape, n) {
    if (shape === circles) {
        ctx.strokeStyle = shape[n].color;
        ctx.lineWidth = shape[n].lineWidth;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.stroke();
    }
    
    if (shape === player) {
        let run = mouseX - shape[0].circleX;
        let rise = mouseY - shape[0].circleY;
        let angle = Math.atan(rise / run);

        ctx.fillStyle = shape[n].circleColor;
        ctx.beginPath();
        ctx.arc(shape[n].circleX, shape[n].circleY, shape[n].circleR, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.fill();

        ctx.strokeStyle = shape[n].lineColor;
        ctx.lineWidth = shape[n].lineWidth;
        ctx.beginPath();
        ctx.save();
        ctx.translate(shape[n].circleX, shape[n].circleY);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -shape[n].circleR);
        ctx.stroke();
        ctx.restore();

        console.log(run, rise, angle, angle / Math.PI * 180);
    }

    if (shape === bullets) {
        ctx.fillStyle = shape[n].color;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.fill();
    }
}

function playerControls() {
    playerMovement();
    playerShoot();
}

function playerMovement() {
    if (player[0].up === true) {
        player[0].circleY -= player[0].yVelocity;
        player[0].lineY -= player[0].yVelocity;
        player[0].lineY1 -= player[0].yVelocity;
        player[0].lastKeyPressed = "w";
    }
    if (player[0].left === true) {
        player[0].circleX -= player[0].xVelocity;
        player[0].lineX -= player[0].xVelocity;
        player[0].lineX1 -= player[0].xVelocity;
        player[0].lastKeyPressed = "a";
    }
    if (player[0].right === true) {
        player[0].circleX += player[0].xVelocity;
        player[0].lineX += player[0].xVelocity;
        player[0].lineX1 += player[0].xVelocity;
        player[0].lastKeyPressed = "d";
    }
    if (player[0].down === true) {
        player[0].circleY += player[0].yVelocity;
        player[0].lineY += player[0].yVelocity;
        player[0].lineY1 += player[0].yVelocity;
        player[0].lastKeyPressed = "s";
    }

    if (player[0].circleX < 0) {
        player[0].circleX = 0;
        player[0].lineX = 0;
        player[0].lineX1 = 0;
    } else if (player[0].circleX > cnv.width) {
        player[0].circleX = cnv.width;
        player[0].lineX = cnv.width;
        player[0].lineX1 = cnv.width;
    }

    if (player[0].circleY < 0) {
        player[0].circleY = 0;
        player[0].lineY = 0;
        player[0].lineY1 = 0;
    } else if (player[0].circleY > cnv.height) {
        player[0].circleY = cnv.height;
        player[0].lineY = cnv.height;
        player[0].lineY1 = cnv.height;
    }
}

function playerShoot() {
    if (mouseIsPressed === true && bulletReload === 15) {
        bullets.push(newBullet(player[0].circleX, player[0].circleY, 5, "white", 0, 2, 0, -10));
        bulletReload = 0;
    }
    bulletReload++;

    if (bulletReload > 15) {
        bulletReload = 15;
    }
}

function moveCircles(n) {
    if (circles[n].xVelocity === 0) {
        circles[n].xVelocity = randomInt(-5, 5);
    }
    if (circles[n].yVelocity === 0) {
        circles[n].yVelocity = randomInt(-5, 5);
    }

    circles[n].x += circles[n].xVelocity;
    circles[n].y += circles[n].yVelocity;

    if (circles[n].x + circles[n].r > cnv.width || circles[n].x - circles[n].r < 0) {
        circles[n].xVelocity = circles[n].xVelocity * -1;
    }
    if (circles[n].y + circles[n].r > cnv.height || circles[n].y - circles[n].r < 0) {
        circles[n].yVelocity = circles[n].yVelocity * -1;
    }
}

function spontaneousGeneration() {
    if (circleSpawnTimer > 120) {
        circles.push(newCircle(randomInt(50, cnv.width - 50), randomInt(50, cnv.height - 50), randomInt(10, 50), 3, 0, 2, randomInt(-5, 5), randomInt(-5, 5), `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`));
        circleSpawnTimer = 0;
    }
    circleSpawnTimer++;
}

function bulletMovement(n) {
    bullets[n].x += bullets[n].xVelocity;
    bullets[n].y += bullets[n].yVelocity;
}

function bulletDetection(n) {
    if (bullets[n].y < 0) {
        bullets.splice(n, 1);
    } else {
        for (let i = 0; i < circles.length; i++) {
            let run = circles[i].x - bullets[n].x;
            let rise = circles[i].y - bullets[n].y;
            let d = Math.sqrt(run ** 2 + rise ** 2);
    
            if (d < bullets[n].r + circles[i].r) {
                circles.splice(i, 1);
                bullets.splice(n, 1);
                return;
            }
        }  
    }
}

function newCircle(x1, y1, r1, lineWidth1, startAngle1, endAngle1, xVelocity1, yVelocity1, color1) {
    return {
        x: x1,
        y: y1,
        r: r1,
        lineWidth: lineWidth1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        xVelocity: xVelocity1,
        yVelocity: yVelocity1,
        color: color1
    };
}

function newPlayer(circleX1, circleY1, circleR1, startAngle1, endAngle1, circleColor1, lineX2, lineY2, lineX3, lineY3, lineWidth1, lineColor1, xVelocity1, yVelocity1, up1, left1, right1, down1, shoot1) {
    return {
        circleX: circleX1,
        circleY: circleY1,
        circleR: circleR1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        circleColor: circleColor1,
        lineX: lineX2,
        lineY: lineY2,
        lineX1: lineX3,
        lineY1: lineY3,
        lineWidth: lineWidth1,
        lineColor: lineColor1,
        xVelocity: xVelocity1,
        yVelocity: yVelocity1,
        up: up1,
        left: left1,
        right: right1,
        down: down1,
        shoot: shoot1,
    };
}

function newBullet(x1, y1, r1, color1, startAngle1, endAngle1, xVelocity1, yVelocity1) {
    return {
        x: x1,
        y: y1,
        r: r1,
        color: color1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        xVelocity: xVelocity1,
        yVelocity: yVelocity1
    };
}

function reset() {
    circles = [];

    player = [];
    player.push(newPlayer(canvasMidWidth, canvasMidHeight, 25, 0, 2, "white", canvasMidWidth, canvasMidHeight, canvasMidWidth, canvasMidHeight - 25, 5, "red", 5, 5, false, false, false, false, false));

    bullets = [];
}