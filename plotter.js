class Plotter {
    constructor(setup) {
        this.setup = setup;

        this.xAxis = setup.xAxis;
        this.yAxis = setup.yAxis;

        this.speed = 0.25;

        this.x = 0;
        this.y = 0;

        this.gridSize = 100;
        //10, 16
    }

    async start() {
        await this.drawLine(0, 0, 10, 16);
        await this.drawLine(10, 16, 3, 14);
        await this.drawLine(5, 8, 0, 0);

    }

    async drawLine(fromX, fromY, toX, toY) {
        if(this.x != fromX || this.y != fromY) {
            this.penUp();
            await this.goToPos(fromX, fromY);
        }

        if(this.x == fromX || this.y == fromY) {
            await this._straightLine(fromX, fromY, toX, toY);
        } else {
            await this._angledLine(fromX, fromY, toX, toY);
        }
    }

    async _straightLine(fromX, fromY, toX, toY) {
        this.penDown();
        await this.goToPos(toX, toY);
        this.penUp();
    }

    async _angledLine() {

    }

    async goToPos(x, y) {
        console.log(`Going to: (${x}, ${y})`);
        let xDist = x - this.x;
        let yDist = y - this.y;

        const speeds = this._getSpeed(xDist, yDist);
        // console.log(speeds);

        let xSpeed = speeds[0];
        let ySpeed = speeds[1] + 0.08;

        if(xDist >= 0) {
            this.motorForward(this.xAxis, xSpeed);
        } else {
            this.motorBackward(this.xAxis, xSpeed);
            xDist *= -1
        }

        if(yDist >= 0) {
            this.motorForward(this.yAxis, ySpeed);
        } else {
            this.motorBackward(this.yAxis, ySpeed);
            yDist *= -1
        }

        xSpeed = xSpeed * 5;
        ySpeed = ySpeed * 5;

        let xTime = this.gridSize * xDist / xSpeed;
        let yTime = this.gridSize * yDist / ySpeed;
        let longerTime = xTime;
        if(yTime >= xTime) {
            longerTime = yTime
        }
        console.log(longerTime);

        this.stopMotor(this.xAxis, longerTime + this.gridSize);
        this.stopMotor(this.yAxis, longerTime);

        await this.setup.timeout(1000);

        this.x = x;
        this.y = y;
    }

    _getSpeed(xDist, yDist) {
        let xSpeed = this.speed;
        let ySpeed = this.speed;

        if(xDist != yDist) {
            xSpeed *= xDist / 5;
            ySpeed *= yDist / 5;
        } 
        if(xSpeed < 0) {
            xSpeed *= -1;
        }
        if(ySpeed < 0) {
            ySpeed *= -1;
        }
        return [xSpeed, ySpeed];
    }

    //basic motor functions
    async stopMotor(motor, time = 0) {
        await this.setup.updateMotorVelocity(0, motor, time);
    }

    async motorForward(motor, speed, time = 0) {
        await this.setup.updateMotorVelocity(speed, motor, time);
    }

    async motorBackward(motor, speed, time = 0) {
        await this.setup.updateMotorVelocity(-speed, motor, time);
    }

    async penDown() {
        console.log('Pen down');
    }

    async penUp() {
        console.log('Pen up');
    }
}

module.exports = Plotter;