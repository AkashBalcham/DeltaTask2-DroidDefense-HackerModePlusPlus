let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth-17;
canvas.height = window.innerHeight;
let c = canvas.getContext('2d');

let score1 = localStorage.getItem('top1') || '';
let score2 = localStorage.getItem('top2') || '';
let score3 = localStorage.getItem('top3') || '';



//Creating the necessary variables
let t1 = 0, t2 = 0, t3 = 0, tRef;

let turrets = [];
let bosses = [];
let bossBullets = [];
let bossBulletsToRemove = [];
let bullets = [];
let bulletsToRemove = [];
let enemyBullets = [];
let enemyBulletsToRemove = [];
let homeBullets = [];
let homeBulletsToRemove = [];
let enemies = [];           //Stores non shooting enemies
let defeatedEnemies = [];
let shootingEnemies = [];   //Stores shooting enemies
let defeatedShootingEnemies = [];
let powerUps = [];

let gEn = '';
let buffer = false;
let notEnd = true;
let creatingEnemy = false;
let initPCount;
let homeTurretAngle;
let shieldActive = 0;
let playerDir = '';
let bulletSpam = 0;
let bulletVelocity = 10;
let enemyVelocity = 3;
let lives = 10;
let maxLives = 10;
let maxBossLives = 15;
let bossLives = 15;
let enemiesKilled = 0;
let bossesKilled = 0;
let score = 0;
let moveSpeed = 10;

let isPaused = 0;

function drawHealthBar() {              //Giving a white background to the health bar
    c.fillStyle = 'white';
    c.fillRect(50, 30, 40*maxLives, 30);
}

function drawPlayerHealthBar() {
    c.fillStyle = 'white';
    c.fillRect(550, 30, 40*10, 30);
}

function drawBossHealthBar() {
    c.fillStyle = 'white';
    c.fillRect(1050, 30, 30*maxBossLives, 30);
}

function drawScore() {                  //Updates the score every frame
    c.fillStyle = 'white';
    c.fillText(`Score: ${score}`, 1550, 55);
}

window.addEventListener('resize', function() {      
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})

let keyStates = {};

window.addEventListener('keydown', function(event) {
    keyStates[event.code] = true;
  });
  
window.addEventListener('keyup', function(event) {
        keyStates[event.code] = false;
});
  
  // Update the player's position based on key states
function updatePlayerPosition() {
    if (keyStates['ArrowLeft'] || keyStates['KeyA']) {
      // Move left
      if (playerPos.x > p1.radius) {
        playerPos.x -= moveSpeed;
        playerText.x -= moveSpeed;
      }
    }
    if (keyStates['ArrowRight'] || keyStates['KeyD']) {
      // Move right
      if (playerPos.x < canvas.width - p1.radius - 2) {
        playerPos.x += moveSpeed;
        playerText.x += moveSpeed;
      }
    }
    if (keyStates['ArrowUp'] || keyStates['KeyW']) {
      // Move up
      if (playerPos.y > p1.radius) {
        playerPos.y -= moveSpeed;
        playerText.y -= moveSpeed;
      }
    }
    if (keyStates['ArrowDown'] || keyStates['KeyS']) {
      // Move down
      if (playerPos.y < canvas.height - p1.radius - 2) {
        playerPos.y += moveSpeed;
        playerText.y += moveSpeed;
      }
    }
}

//Keeps track of the mouse position
window.addEventListener('mousemove', function(event) {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;

})

//Notes the position when we click and creates a bullet object
window.addEventListener('click', function(event) {          //c.fillRect(1600, 800, 90, 40);
    if(event.button === 0) {
        /*
        tRef = new Date();
        
        console.log(bulletSpam);
        mouseClickPos.x = mousePos.x;
        mouseClickPos.y = mousePos.y;
        console.log("time difference: ", tRef-t3);
        if(tRef - t3 >= 800) {
            if(bulletSpam === 0) {
                bulletSpam++;
                t1 = new Date();
                console.log(t1);
                bullets.push(new Bullet('Player', p1.x, p1.y));
            } else if (bulletSpam === 2) {
                bulletSpam++;
                t3 = new Date();
                console.log(t3);
                if(t3-t2 >= 800) {
                    bulletSpam = 0;
                }
                bullets.push(new Bullet('Player', p1.x, p1.y));
                bulletSpam = 0;
            } else {
                t2 = new Date();
                bulletSpam++;
                console.log(t2);
                if(t2-t1 >= 800) {
                    bulletSpam = 0;
                }
                bullets.push(new Bullet('Player', p1.x, p1.y));
            }
            /*
            if((t2-t1) >= 700 || (t3-t2) >= 700) {
                bulletSpam = 0;
                bullets.push(new Bullet());
            } else if((t3-t1) >= 700){
                bullets.push(new Bullet());
            } 
            */
        mouseClickPos.x = mousePos.x;
        mouseClickPos.y = mousePos.y;
        bullets.push(new Bullet('Player', p1.x, p1.y));
    }
})

//Useful objects to store the required data
let playerPos = {x: undefined,
                 y: undefined
};

let mousePos = {x: undefined,
                y: undefined
};

let mouseClickPos = {x: undefined,
                     y: undefined
};

let playerText = {x: 163,
                  y: canvas.height - 30
};

//A class containing attributes and methods for the controllable player
class Player {
    constructor() {
        this.x = 200;
        this.y = window.innerHeight - 100;
        this.lives = 10;
        playerPos.x = this.x;
        playerPos.y = this.y;
        this.radius = 40;
        this.colour = 'rgb(204, 51, 153)';
        
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
        c.stroke();
    }

    update() {
        this.draw();

        
        if(playerDir === 'left') {
            if(playerPos.x > p1.radius) {
                playerPos.x -= 20;
                playerText.x -= 20; 
            }
        } else if (playerDir === 'right') {
            if(playerPos.x < canvas.width - p1.radius-2) {
                playerPos.x += 20;
                playerText.x += 20;
            } 
        }
        playerDir = '';
        this.x = playerPos.x;
        this.y = playerPos.y;
    }
}

class Boss {
    constructor() {
        this.x = canvas.width/2;
        this.y = -60;
        this.radius = 50;
        this.colour = 'red';
        this.count = 0;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
    }

    update() {
        this.draw();

        if(this.y <= 180) {
            this.y += 1;
        }
        if(this.count % 100 === 0) {
            bossBullets.push(new BossBullet(this.x, this.y));
        }
        this.count++;
    }
}

class BossBullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.colour = 'rgb(172, 115, 57)';
        this.angle = Math.atan2(p1.y - this.y, p1.x - this.x);
        //this.direction = Math.sign(this.x - p1.x);
        this.dx = Math.cos(this.angle) * (bulletVelocity + 7);  
        this.dy = Math.sin(this.angle) * (bulletVelocity + 7);
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
    }

    update() {
        this.draw();
        this.x += this.dx;
        this.y += this.dy;

        if(this.x <= this.radius || this.x >= canvas.width - this.radius || this.y <= this.radius || this.y >= canvas.height - this.radius) {
            bossBulletsToRemove.push(this);
        }
    }

}


//A class which dictates behaviour of every bullet
class Bullet {
    constructor(type, x, y) {
        this.type = type;
        //this.radius = 10;
        if(this.type === 'Player') {
            this.colour = 'rgb(26, 26, 255)';
            this.x = x;
            this.y = y;
            this.radius = 12;
            this.angle = Math.atan((mouseClickPos.y - p1.y) / (mouseClickPos.x - p1.x));
            this.direction = Math.sign(mouseClickPos.x - p1.x);
            this.dx = Math.cos(this.angle) * bulletVelocity * this.direction;
            this.dy = Math.sin(this.angle) * bulletVelocity * this.direction;
        } else if (this.type === 'Enemy') {
            this.count = 0;
            this.radius = 10;
            this.colour = 'rgb(0, 204, 153)';
            this.x = x;
            this.y = y;
            this.angle = Math.atan((this.y - p1.y) / (this.x - p1.x));
            this.direction = Math.sign(this.x - p1.x);
            this.dx = Math.cos(this.angle) * (bulletVelocity-3) * -this.direction;
            this.dy = Math.sin(this.angle) * (bulletVelocity-3) * -this.direction;
        }
        
        
    }
    

    shoot() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
    }

    update() {
        
        this.shoot();
       
        this.x += this.dx;
        this.y += this.dy;

        if (
            this.x <= this.radius ||
            this.x >= canvas.width - this.radius ||
            this.y <= this.radius ||
            this.y >= canvas.height - this.radius
          ) {
            if(this.type === 'Player') {
                bulletsToRemove.push(this);
            } else if (this.type === 'Enemy') {
                enemyBulletsToRemove.push(this);
            }
            
        }
    }
}

//Dictatres behaviour of the enemy bot
class Enemy {
    constructor(x) {
        this.count = 0;
        this.x = x;
        this.y = -100;
        this.radius = 30;
    }

    draw() {
       c.beginPath();
       c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
       c.fillStyle = 'rgb(184, 46, 138)';
       c.fill();
    }

    update() {
        this.draw();
        if(this.y <= 200) {
            this.y += 10;
        }
        

        const angle = Math.atan2(p1.y - this.y, p1.x - this.x);
        const dx = Math.cos(angle) * bulletVelocity * -1;
        const dy = Math.sin(angle) * bulletVelocity * -1;

        if (this.count % 100 === 0) { // Shoot every 400 frames
        //const bullet = new Bullet('Enemy', this.x, this.y, dx, dy);
        const bullet = new EnemyBullet(this.x, this.y);
        enemyBullets.push(bullet);
        }
        this.count++;
        
    }
}

class EnemyBullet {
    constructor(x, y) {
        this.count = 0;
        this.radius = 10;
        this.colour = 'rgb(0, 204, 102)';
        this.x = x;
        this.y = y;
        this.angle = Math.atan((this.y - p1.y) / (this.x - p1.x));
        this.direction = Math.sign(this.x - p1.x);
        this.dx = Math.cos(this.angle) * (bulletVelocity+3) * -this.direction;
        this.dy = Math.sin(this.angle) * (bulletVelocity+3) * -this.direction;
        this.count = 0;
    }

    shoot() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
    }

    update() {
        
        this.shoot();
        this.count++ ;
       
        let angle = Math.atan((this.y - p1.y) / (this.x - p1.x));
        let direction = Math.sign(this.x - p1.x);
        let dx = Math.cos(angle) * (bulletVelocity-3) * -direction;
        let dy = Math.sin(angle) * (bulletVelocity-3) * -direction;

        this.x += dx;
        this.y += dy;

        if(this.count % 160 === 0) {
            enemyBulletsToRemove.push(this);
        }


        if (
            this.x <= this.radius ||
            this.x >= canvas.width - this.radius ||
            this.y <= this.radius ||
            this.y >= canvas.height - this.radius
          ) {
            if(this.type === 'Player') {
                bulletsToRemove.push(this);
            } else if (this.type === 'Enemy') {
                enemyBulletsToRemove.push(this);
            }
            
        }
    }
}


class NonShootingEnemy {
    constructor(x) {
        this.x = x;
        this.y = 100;
        this.width = 40;
        this.height = 40;
        this.isAlive = true;
        this.targetX = home.x + home.width/2;
        this.targetY = home.y + home.height/2;
        this.angle = Math.atan((this.targetY - this.y)/(this.targetX - this.x));
        this.direction = Math.sign(this.targetX - this.x);
        this.target = 'home';
        this.dx = Math.cos(this.angle) * enemyVelocity * this.direction;
        this.dy = Math.sin(this.angle) * enemyVelocity * this.direction;
    }

    draw() {
        c.fillStyle = 'rgb(255, 51, 51)';
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.x += this.dx;
        this.y += this.dy;
    }
}


//A class for the home base to be defened
class HomeBase {
    constructor() {
        this.width = 150;
        this.height = 150;
        this.x = (canvas.width-this.width)/2;
        this.y = canvas.height - 300;
        this.colour ='rgb(200, 200, 0)';
        this.count = 0;
    }

    draw() {
        if(shieldActive) {
            c.beginPath();
            c.arc(this.x + this.width/2, this.y + this.height/2, this.width / 2**0.5, 0, Math.PI * 2);
            c.fillStyle = 'rgba(242, 242, 242, 0.5)';
            c.fill();

            this.count++;
            
            if(this.count % 500 === 0) {
                shieldActive = 0;
                p = setInterval(generatePowerUp, 6000);
            }

        }
        


        c.fillStyle = this.colour;
        c.fillRect(this.x, this.y, this.width, this.height);
       

        c.font = '25px';
        c.fillStyle = 'white';
        c.fillText('Home', this.x+40, this.y+80);
    }

    update() {
        this.draw();
    }
}
home = new HomeBase();      //Creating a home base

class HomeBullet {
    constructor(X, Y) {
        this.x = home.x + home.width / 2;
        //this.y = home.y + home.height / 2;
        this.y = home.y;
        this.radius = 10;
        this.colour = 'rgb(255, 117, 26)';
        this.targetX = X;
        this.targetY = Y;

        // Calculate the angle between the bullet and the target
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        homeTurretAngle = this.angle;
        // Calculate the velocity components
        //const bulletVelocity = 3; // Adjust this value as needed
        this.dx = Math.cos(this.angle) * (bulletVelocity-5);
        this.dy = Math.sin(this.angle) * (bulletVelocity-5);
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.colour;
        c.fill();
    }
    
    update() {
        this.draw();
        this.x += this.dx;
        this.y += this.dy;
        if (
            this.x <= this.radius ||
            this.x >= canvas.width - this.radius ||
            this.y <= this.radius ||
            this.y >= canvas.height - this.radius
          ) {
            homeBulletsToRemove.push(this);
            
        }
    }
}


//A class to set the width of the health bar based on number of lives
class HealthBar {
    constructor(type) {
        this.type = type;
        if(this.type === home) {
            this.x = 50;
        } else if (type === bosses[0]){
            this.x = 1050;
        }
        
        this.y = 30;
        //this.width = 500;
        this.height = 30;
        //this.colour = ;
    }

    draw() {
        
        if(this.type === home) {
            this.width = lives * 40;
            if(lives >= 7) {
                this.colour = 'rgb(0, 204, 0)';
            } else if (lives < 7 && lives >= 4) {
                this.colour = 'rgb(255, 204, 0)';
            } else if (lives >= 1 && lives < 4) {
                this.colour = 'rgb(255, 51, 0)';
            }
            c.fillStyle = this.colour;
            c.fillRect(this.x, this.y, this.width, this.height);
    
            c.fillStyle = 'black';
            c.fillText('Home Health', 70, 55);
        } else if (this.type === bosses[0]) {
            this.width = bossLives * 30;
            if(bossLives >= 12) {
                this.colour = 'rgb(0, 204, 0)';
            } else if (bossLives < 12 && bossLives >= 9) {
                this.colour = 'rgb(204, 255, 51)';
            } else if (bossLives >= 6 && bossLives < 9) {
                this.colour = 'rgb(253, 153, 0)';
            } else if (bossLives >= 3 && bossLives < 6) {
                this.colour = 'rgb(255, 71, 26)'
            } else if (bossLives < 3) {
                this.colour = 'rgb(255, 0, 0)';
            }
            c.fillStyle = this.colour;
            c.fillRect(this.x, this.y, this.width, this.height);
    
            c.fillStyle = 'black';
            c.fillText('Boss Health', 1060, 55);
        }
        
    }

    update() {
        this.draw();
    }
}


class PlayerHealthBar {
    constructor() {
        this.x = 550;
        this.y = 30;
        //this.width = 500;
        this.height = 30;
        //this.colour = ;
    }

    draw() {
        this.width = p1.lives * 40;
        if(p1.lives >= 7) {
            this.colour = 'rgb(0, 204, 0)';
        } else if (p1.lives < 7 && p1.lives >= 4) {
            this.colour = 'rgb(255, 204, 0)';
        } else if (p1.lives >= 1 && p1.lives < 4) {
            this.colour = 'rgb(255, 51, 0)';
        }
        c.fillStyle = this.colour;
        c.fillRect(this.x, this.y, this.width, this.height);

        c.fillStyle = 'black';
        c.fillText('Player Health', 570, 55);
    }

    update() {
        this.draw();
    }
}





class PowerUp {
    constructor() {
        this.radius = 10;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height - 2*this.radius) + this.radius;
        shieldActive = 0;
        this.count = 0;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'rgb(214, 51, 255)';
        c.fill();
    }

    update() {
        this.draw();
        if(shieldActive) {
            console.log('protective shield');
            
        }    
    }
}

class Turret {
    constructor(shooter) {
        this.player = shooter;
        this.width = 70;
        this.height = 20;
        this.colour = 'gray';
        this.rotation = Math.PI * 2;
    }

    draw() {
        if(this.player === p1) {
            c.save();
            c.translate(this.player.x, this.player.y);
            this.rotation = Math.atan2(mousePos.y - this.player.y, mousePos.x - this.player.x);
            c.rotate(this.rotation);
            c.fillStyle = this.colour;
            c.fillRect(0, -this.height/2, this.width, this.height); // Adjust position for centering
            c.restore();
        } else if (this.player === home) {
            this.width = 70;
            this.rotation = Math.PI * 2;
            c.save();
            c.translate(this.player.x + this.player.width/2, this.player.y + this.height/2);
            this.rotation = homeTurretAngle;
            c.rotate(this.rotation);
            c.fillStyle = this.colour;
            c.fillRect(0, -this.height/2, this.width, this.height); // Adjust position for centering
            c.restore();
        } else if (this.player === bosses[0]) {
            this.width = 80;
            this.height = 40;
            c.save();
            c.translate(this.player.x, this.player.y);
            this.rotation = Math.atan2(p1.y - this.player.y, p1.x - this.player.x);
            c.rotate(this.rotation);
            c.fillStyle = this.colour;
            c.fillRect(0, -this.height/2, this.width, this.height);
            c.restore();
        } else {
            this.width = 50;
            c.save();
            c.translate(this.player.x, this.player.y);
            this.rotation = Math.atan2(p1.y - this.player.y, p1.x - this.player.x);
            c.rotate(this.rotation);
            c.fillStyle = this.colour;
            c.fillRect(0, -this.height/2, this.width, this.height);
            c.restore();
        }
        
    }
}


phb1 = new PlayerHealthBar();

//let boss1 = new Boss();
//bosses.push(boss1);
//bossHealthBar = new HealthBar(bosses[0]);
let bossTur;


home = new HomeBase();      //Creating a home base
hb1 = new HealthBar(home);      //Creating a health bar

p1 = new Player();          //Creating the user-controlled player
let turPlayer = new Turret(p1);
let homeTur = new Turret(home);

//Creating initial 4 enemy bots
e1 = new NonShootingEnemy(Math.floor(Math.random() * canvas.width - 2*80) + 80);
e2 = new NonShootingEnemy(Math.floor(Math.random() * canvas.width - 2*80) + 80);
e3 = new NonShootingEnemy(Math.floor(Math.random() * canvas.width - 2*80) + 80);
e4 = new NonShootingEnemy(Math.floor(Math.random() * canvas.width - 2*80) + 80);

//se1 = new Enemy(Math.floor(Math.random() * canvas.width - 2*100) + 100);
//te1 = new Turret(se1);
//se2 = new Enemy(Math.floor(Math.random() * canvas.width - 2*100) + 100);
//te2 = new Turret(se2);

//Storing the bots in an array
enemies.push(e1);
enemies.push(e2);
enemies.push(e3);
enemies.push(e4);

///shootingEnemies.push(se1);
//shootingEnemies.push(se2);

//turrets.push(te1);
//turrets.push(te2);


function generateBoss() {
    bosses.splice(0, 1);
    bosses.push(new Boss());
    bossHealthBar = new HealthBar(bosses[0]);
    bossTur = new Turret(bosses[0]);
}
generateBoss();

//Keeps creating 3 enemies after 4 seconds
function generateEnemy() {
    clearInterval(x);

    let posX1 = Math.floor(Math.random() * canvas.width - 2*80) + 80;
    let posX2 = Math.floor(Math.random() * canvas.width - 2*80) + 80;
    let posX3 = Math.floor(Math.random() * canvas.width - 2*80) + 80;
    enemies.push(new NonShootingEnemy(posX1));
    enemies.push(new NonShootingEnemy(posX2));
    enemies.push(new NonShootingEnemy(posX3));

    x = setInterval(generateEnemy, 4000);
}
let x = setInterval(generateEnemy, 4000);

function generateShootingEnemy() {
    //clearInterval(gEn);
    buffer = false;
    let x1 = Math.random()*(canvas.width/2 - 100);
    shootingEnemies.push(new Enemy(x1));
    turrets.push(new Turret(shootingEnemies[shootingEnemies.length-1]));
    let x2 = canvas.width/2 + Math.random()*(canvas.width/2 - 100);
    shootingEnemies.push(new Enemy(x2));
    turrets.push(new Turret(shootingEnemies[shootingEnemies.length-1]));
    console.log(shootingEnemies.length);
    /*
    for(let i=0; i<shootingEnemies.length; i++) {
        turrets.push(new Turret(shootingEnemies[i]));
    }
    */
}
generateShootingEnemy();

function generatePowerUp() {
    clearInterval(p);
    if(powerUps) {
        for(let i=0; i<powerUps.length; i++) {
            powerUps.splice(0, 1);
        }
        
    }
    powerUps = [];
    powerUps.push(new PowerUp());
    p = setInterval(generatePowerUp, 6000);
}
p = setInterval(generatePowerUp, 6000);

function init() {
    p1.update();
}

function getDistance(x1, y1, x2, y2) {
    return (((x1-x2)**2 + (y1-y2)**2)**0.5);
}


function collideCircle(x1, y1, x2, y2, r1, r2) {
    return (((x1-x2)**2 + (y1-y2)**2))**0.5 <= r1+r2;
}


//Checks if 2 rectangles are colliding
function collideRect(r1, r2) {
    if(r1.x <= r2.x + r2.width && r1.x + r1.width >= r2.x && r1.y <= r2.y + r2.height && r1.y + r1.height >= r2.y) {
        return true;
    } else {return false;}
}

//Checks if a circle and a rectangle are colliding
function checkCollision(circle, rectangle) {
    let circleDistanceX = Math.abs(circle.x - rectangle.x - rectangle.width / 2);
    let circleDistanceY = Math.abs(circle.y - rectangle.y - rectangle.height / 2);
  
    if (circleDistanceX > (rectangle.width / 2 + circle.radius)) {
      return false;
    }
    if (circleDistanceY > (rectangle.height / 2 + circle.radius)) {
      return false;
    }
  
    if (circleDistanceX <= (rectangle.width / 2) && (circleDistanceY <= (rectangle.height / 2))) {
      return true;
    }
  
    let cornerDistanceSq = Math.pow(circleDistanceX - rectangle.width / 2, 2) +
                           Math.pow(circleDistanceY - rectangle.height / 2, 2);
  
    return (cornerDistanceSq <= Math.pow(circle.radius, 2));
}

//Redraws the entire screen after each frame
function animate() {
    if(notEnd) {
        requestAnimationFrame(animate);         //Calls the animate function after each frame
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);       //Clears the canvas to redraw

        drawHealthBar();            //Updates the health bar width
        drawPlayerHealthBar();
        drawBossHealthBar();
        
        
        for(let i=0; i<bosses.length; i++) {
            bosses[i].update();
        }




        for(let i=0; i<bullets.length; i++) {
            bullets[i].update();        //Updates the bullets shot which is in the frame
        }

        
        for(let i=0; i<enemyBullets.length; i++) {
            enemyBullets[i].update();
            //console.log(enemyBullets[i].count);
        }



        //Removes the bullets which are out of the frame
        for (let i = 0; i < bulletsToRemove.length; i++) {
            const bullet = bulletsToRemove[i];
            const index = bullets.indexOf(bullet);
            if (index > -1) {
            bullets.splice(index, 1);
            }
        }
        bulletsToRemove = [];

        for(let i=0; i<enemyBulletsToRemove.length; i++) {
            const bulletE = enemyBulletsToRemove[i];
            const indexE = enemyBullets.indexOf(bulletE);
            if(indexE > -1) {
                enemyBullets.splice(indexE, 1);
            }
        }
        enemyBulletsToRemove = [];

        //Creates the text below the player
        c.font = '25px Arial';
        c.fillStyle = 'white';
        c.fillText('Player', playerText.x, playerText.y);
        
        for(let i=0; i<enemies.length; i++) {
            if(enemies[i].isAlive) {
                enemies[i].update();
            }

            //Checking if the enemy has attacked the home base successfully
            if(collideRect(home, enemies[i])) {
                console.log("Destroying!!");
                if(!shieldActive) {
                    --lives;                //Decreases the width of the health bar
                    if(lives === 0) {       //Checking if all lives are lost
                        clearInterval(x);   //Stops generating enemies
                        enemies = [];
                        break;
                    }
                }
                
                enemies[i].isAlive = false;
                defeatedEnemies.push(i);
            }
            
        }

        for(let i=0; i<shootingEnemies.length; i++) {
            turrets[i].draw();
            shootingEnemies[i].update();

        }

        for(let i=0; i<enemies.length; i++) {
            if(getDistance(enemies[i].x + enemies[i].width/2, enemies[i].y + enemies[i].height/2, home.x + home.width/2, home.y + home.height/2) <= 400 && getDistance(enemies[i].x + enemies[i].width/2, enemies[i].y + enemies[i].height/2, home.x + home.width/2, home.y + home.height/2) >= 395) {
                //console.log("Home is shooting...");
                if(Math.random() >= 0.5) {
                    homeBullets.push(new HomeBullet(enemies[i].x + enemies[i].width/2, enemies[i].y + enemies[i].height/2));
                }
                
            }
        }

        for(let i=0; i<bosses.length; i++) {
            bossTur.draw();
            bosses[i].update();
        }

        for(let i=0; i<bossBullets.length; i++) {
            bossBullets[i].update();
        }

        
        for(let i=0; i<homeBullets.length; i++) {
            //console.log(i);
            //console.log("Home shot the bullets")
            homeBullets[i].update();
            //console.log(homeBullets[i].x, homeBullets[i].y);
        }
        
        for (let i = 0; i < bossBulletsToRemove.length; i++) {
            const bullet = bossBulletsToRemove[i];
            const index = bossBulletsToRemove.indexOf(bullet);
            if (index > -1) {
                bossBulletsToRemove.splice(index, 1);
            }
        }
        bossBulletsToRemove = [];


        for (let i = 0; i < homeBulletsToRemove.length; i++) {
            const bullet = homeBulletsToRemove[i];
            const index = homeBullets.indexOf(bullet);
            if (index > -1) {
            homeBullets.splice(index, 1);
            }
        }
        homeBulletsToRemove = [];

        for(let i=0; i<bullets.length; i++) {
            for(let j=0; j<shootingEnemies.length; j++) {
                if(collideCircle(bullets[i].x, bullets[i].y, shootingEnemies[j].x, shootingEnemies[j].y, bullets[i].radius, shootingEnemies[j].radius)) {
                    defeatedShootingEnemies.push(j);
                }
            }
        }

        for(let i=0; i<bullets.length; i++) {
            for(let j=0; j<bossBullets.length; j++) {
                if(collideCircle(bullets[i].x, bullets[i].y, bossBullets[j].x, bossBullets[j].y, bullets[i].radius, bossBullets[j].radius)) {
                    bullets.splice(i, 1);
                    bossBullets.splice(j, 1);
                }
            }
        }

        

        //buffer = false, init
        if(shootingEnemies.length === 0) {
            if(!buffer) {
                gEn = setTimeout(generateShootingEnemy, 3000);
            }
            buffer = true;
        }


        if(lives === 0 || p1.lives <= 0) {
            p1.lives = 0;
            endGame();
        }

        //console.log(defeatedEnemies);
        for(let i=0; i<defeatedEnemies.length; i++) {
            enemies.splice(defeatedEnemies[i], 1);
        }
        defeatedEnemies = [];

        for(let i=0; i<enemyBullets.length; i++) {
            if(collideCircle(enemyBullets[i].x, enemyBullets[i].y, p1.x, p1.y, enemyBullets[i].radius, p1.radius)) {
                p1.lives--;
                enemyBullets.splice(i, 1);
            }
        }

        //Checks if the bullet hits the enemy bot
        for(let i=0; i<bullets.length; i++) {
            for(let j=0; j<enemies.length; j++) {
                if(checkCollision(bullets[i], enemies[j])) {
                    score += 20;               
                    enemiesKilled++;
                    if(score > 0 && score%100 === 0) {
                        if(lives < maxLives) {
                            ++lives;
                        }
                    }
                    
                    bullets.splice(i, 1);
                    enemies[j].isAlive = false;
                    defeatedEnemies.push(j);
                }

                if(collideCircle(bullets[i].x, bullets[i].y, bosses[0].x, bosses[0].y, bullets[i].radius, bosses[0].radius)) {
                    bossLives--;
                    bullets.splice(i, 1);
                    score += 40;
                }
                if(score > 0 && score%200 === 0) {
                    if(p1.lives < 10) {
                        p1.lives++;
                    }
                }

                if(bossLives <= 0) {
                    bossLives = maxBossLives;
                    bossesKilled++;
                    generateBoss();
                }

            }
        }

        for(let i=0; i<homeBullets.length; i++) {
            for(let j=0; j<enemies.length; j++) {
                if(checkCollision(homeBullets[i], enemies[j])) {
                    homeBullets.splice(i, 1);
                    homeBulletsToRemove.push(i)
                    enemies[j].isAlive = false;
                    defeatedEnemies.push(j);
                }
            }
        }

        for(let i=0; i<homeBulletsToRemove; i++) {
            homeBullets.splice(i, 1);
        }
        homeBulletsToRemove = [];


        //Removes the killed enemies from the screen
        for(let i=0; i<defeatedEnemies.length; i++) {
            enemies.splice(defeatedEnemies[i], 1);
        }
        defeatedEnemies = [];

        for(let i=0; i<defeatedShootingEnemies.length; i++) {
            const enemyIndex = defeatedShootingEnemies[i];
            shootingEnemies.splice(enemyIndex, 1);
            turrets.splice(enemyIndex, 1);
        }
        defeatedShootingEnemies = [];
        

        hb1.update();
        phb1.update();
        bossHealthBar.update();
        drawScore();        //Updates the score

        for(let i=0; i<powerUps.length; i++) {
            powerUps[i].update();
        }

        for(let i=0; i<powerUps.length; i++) {
            if(collideCircle(powerUps[i].x, powerUps[i].y, p1.x, p1.y, powerUps[i].radius, p1.radius)) {
                //initPCount = powerUps[i].count;
                //console.log(obt)
                shieldActive = 1;
                clearInterval(p);
                for(let i=0; i<powerUps.length; i++) {
                    powerUps.splice(0, 1);
                }
                powerUps = [];
                
            }
        }

        

        


        for(let i=0; i<bossBulletsToRemove.length; i++) {
            bossBullets.splice(i, 1);
        }
        bossBulletsToRemove = [];
        //bossTur.draw();



        homeTur.draw();
        home.update();

        turPlayer.draw();
        updatePlayerPosition();
        p1.update();
        //turPlayer.draw();
    //drawPauseButton();
    }
}

//A function when the game ends
function endGame() {
    notEnd = false;
    clearInterval(p);
    clearInterval(x);
    for(let i=0; i<enemies.length; i++) {
        this.count = 0;
    }
    if(score1 === '') {
        document.querySelector('.first').innerHTML = `1.${score}`;
        localStorage.setItem('top1', `${score}`);
    } else if (score2 === '') {
        if(score > score1) {
            document.querySelector('.first').innerHTML = `1)${score} pts`;
            localStorage.setItem('top1', `${score}`);
            document.querySelector('.second').innerHTML = `2)${score1} pts`; 
            localStorage.setItem('top2', `${score1}`);
        } else {
            document.querySelector('.first').innerHTML = `1)${score1} pts`;
            localStorage.setItem('top1', `${score1}`);
            document.querySelector('.second').innerHTML = `2)${score} pts`; 
            localStorage.setItem('top2', `${score}`);
        }
    } else if (score3 === '') {
        if(score > score1) {
            document.querySelector('.first').innerHTML = `1)${score} pts`;
            localStorage.setItem('top1', `${score}`);
            document.querySelector('.second').innerHTML = `2)${score1} pts`; 
            localStorage.setItem('top2', `${score1}`);
            document.querySelector('.third').innerHTML = `3)${score2} pts`;
            localStorage.setItem('top3', `${score2}`);
        } else if (score > score2 && score <= score1) {
            document.querySelector('.first').innerHTML = `1)${score1} pts`;
            localStorage.setItem('top1', `${score1}`);
            document.querySelector('.second').innerHTML = `2)${score} pts`; 
            localStorage.setItem('top2', `${score}`);
            document.querySelector('.third').innerHTML = `3)${score2} pts`;
            localStorage.setItem('top3', `${score2}`);
        } else if (score <= score2) {
            document.querySelector('.first').innerHTML = `1)${score1} pts`;
            localStorage.setItem('top1', `${score1}`);
            document.querySelector('.second').innerHTML = `2)${score2} pts`; 
            localStorage.setItem('top2', `${score2}`);
            document.querySelector('.third').innerHTML = `3)${score} pts`;
            localStorage.setItem('top3', `${score}`);
        }
    } else {
        if(score > score1) {
            document.querySelector('.first').innerHTML = `1)${score} pts`;
            localStorage.setItem('top1', `${score}`);
            document.querySelector('.second').innerHTML = `2)${score1} pts`; 
            localStorage.setItem('top2', `${score1}`);
            document.querySelector('.third').innerHTML = `3)${score2} pts`;
            localStorage.setItem('top3', `${score2}`);
        } else if (score > score2) {
            document.querySelector('.first').innerHTML = `1)${score1} pts`;
            localStorage.setItem('top1', `${score1}`);
            document.querySelector('.second').innerHTML = `2)${score} pts`; 
            localStorage.setItem('top2', `${score}`);
            document.querySelector('.third').innerHTML = `3)${score2} pts`;
            localStorage.setItem('top3', `${score2}`);
        } else if (score > score3) {
            document.querySelector('.first').innerHTML = `1)${score1} pts`;
            localStorage.setItem('top1', `${score1}`);
            document.querySelector('.second').innerHTML = `2)${score2} pts`; 
            localStorage.setItem('top2', `${score2}`);
            document.querySelector('.third').innerHTML = `3)${score} pts`;
            localStorage.setItem('top3', `${score}`);
        }
    }
    document.querySelector('.score').innerHTML = `Score: ${score}`;
    document.querySelector('.enemies-killed').innerHTML = `Enemy bots destroyed: ${enemiesKilled}`;
    document.querySelector('.enemies-killed').innerHTML = `Bosses destroyed: ${bossesKilled}`;
    document.querySelector('.overlay').style.display = 'block';
}

//Keeps updating all the elements on the canvas
animate();