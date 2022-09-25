class Player {
    constructor(position = new vector2(0, 0), size = 10, jumpSpeed = 1, color = "black", controller) {
        this.position = position;
        this.size = size;
        this.jumpSpeed = jumpSpeed;
        this.color = color;
        this.controller = controller;

        this.col = new collider(new vector2(), 0);
        this.animationFrames = 0;
        this.maxAnimationsFrames = 12;
        this.spr = 0;
        this.groundFrames = 0;
    }

    setCollider(col = new collider(new vector2(this.position.x, this.position.y), this.size)) {
        this.col = col;
    }

    /**Runs rendering logic */
    render() {
        ctx.fillStyle = this.color;
        ctx.drawImage(spritesheet, 40 * this.spr, 41 + (this.jumping) * 40, 40, 40, this.position.x, this.position.y, this.size, this.size);
    }


    jump() {
        this.jumpSpeed = 14.4;
        this.jumping = true;
        this.groundFrames = 0;
    }

    /**Runs game logic */
    tick() {
        let move = new vector2(0, -this.jumpSpeed);
        this.position = this.position.add(move);

        if(this.animationFrames > 0)
        {
            if(!this.jumping)
            this.animationFrames--;
        }
        else
        {
            if(this.spr == 0)
            {
                this.spr++;
            }
            else
            {
                this.spr--;
            }

            if(this.maxAnimationsFrames > 2)
            {
                this.maxAnimationsFrames = Math.round(26 - speed * 2);
            }
            else
            {
                this.maxAnimationsFrames = 2; 
            }
            
            this.animationFrames = this.maxAnimationsFrames;
        }

        this.jumpSpeed -= gravity;
        


        this.position = clampPosition(this.position, this.size, WIDTH, HEIGHT - FLOOR);
        this.col.position = this.position;



        if (this.position.y == HEIGHT - this.size - FLOOR) {
            this.jumping = false;
            if(this.groundFrames == 0)
            {
                this.controller.state.Button = false;
            }
            this.groundFrames++;
        }

        if (this.controller.state.Button && this.jumping == false) {
            this.jump();
        }

        if(this.controller.state.Button && this.jumping && this.jumpSpeed < -1)
        {
            this.jumpSpeed += 0.65;
        }

        

        for (let i = 0; i < entities.length; i++) {
            if (entities[i] == this) {
                continue;
            }
            if (this.col.checkCollision(entities[i].col)) {
                RUN = false;

                ctx.fillStyle = "white"
                ctx.font = "24px Courier New small-caps";

                ctx.fillText("press [r] to retry", 430, 150);
                document.getElementById("inputDiv").classList = "input show";
                
            }
        }
    }
}



class cactus {
    constructor(position = new vector2(0, 0), size = 10, speed = 1, color = "black") {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.color = color;

        this.col = new collider(new vector2(), 0);
    }

    setCollider(col = new collider(new vector2(this.position.x, this.position.y), this.size)) {
        this.col = col;
    }

    /**Runs rendering logic */
    render() {
        ctx.fillStyle = this.color;
        ctx.drawImage(spritesheet, 0, 0, 40, 40, this.position.x, this.position.y, this.size, this.size);
    }

    /**Draws a square on the specified coordinates of the canvas */
    drawSquare(pos, size) {
        ctx.strokeRect(pos.x, pos.y, size, size);
    }

    /**Runs game logic */
    tick() {
        var move = new vector2(-speed, 0);
        this.position = this.position.add(move);
        this.col.position = this.position;
    }
}






class particle {
    constructor(position = new vector2(0, 0), size = 10, speed = 1, color = "black") {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.color = color;
    }

    /**Runs rendering logic */
    render() {
        ctx.fillStyle = this.color;
        this.drawSquare(this.position, this.size);
    }

    /**Draws a square on the specified coordinates of the canvas */
    drawSquare(pos, size) {
        ctx.fillRect(pos.x, pos.y, size, size);
    }

    /**Runs game logic */
    tick() {
        var move = new vector2(-(this.speed + speed), 0);
        this.position = this.position.add(move);
    }
}






class background {
    constructor(position = new vector2(0, 0), size = 1, speed = 1, sprIndex = 0) {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.sprIndex = sprIndex;
    }

    /**Runs rendering logic */
    render() {
        ctx.fillStyle = this.color;
        ctx.drawImage(spritesheet, 40 * this.sprIndex, 0, 40 * this.size, 40, this.position.x, this.position.y, 40 * this.size, 40);
    }

    /**Runs game logic */
    tick() {
        var move = new vector2(-(this.speed + speed), 0);
        this.position = this.position.add(move);
    }
}


class cloud {
    constructor(position = new vector2(0, 0), size = 1, speed = 1, sprIndex = 0) {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.sprIndex = sprIndex;
    }

    /**Runs rendering logic */
    render() {
        ctx.fillStyle = this.color;
        ctx.drawImage(spritesheet, 40 * this.sprIndex, 0, 40 * this.size, 40, this.position.x, this.position.y, 40 * this.size, 40);
    }

    /**Runs game logic */
    tick() {
        var move = new vector2(-(this.speed), 0);
        this.position = this.position.add(move);
    }
}









class collider {
    constructor(position = new vector2(), size = new vector2()) {
        this.position = position;

        if (typeof (size) == vector2) {
            this.size = size;
        }
        else {
            this.size = new vector2(size, size);
        }

        collider.prototype.toString = function () {
            return "(" + this.position.x + "," + this.position.y + ")";
        }
    }

    /**Returns wheter this object's shape overlaps with another shape */
    checkCollision(col) {
        if (col.size.x == 0 || col.size.y == 0) {
            return false;
        }

        if (this.position.x + this.size.x < col.position.x || this.position.x > col.position.x + col.size.x) {
            return false;
        }
        if (this.position.y + this.size.y < col.position.y || this.position.y > col.position.y + col.size.y) {
            return false;
        }
        return true;
    }
}
