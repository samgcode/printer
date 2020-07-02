class Plotter {
    constructor(setup) {
        this.setup = setup;

        this.xAxis = setup.xAxis;
        this.yAxis = setup.yAxis;

        this.speed = 0.5;

        this.x = 0;
        this.y = 0;

        this.gridSize = 50;
    }

    async start() {
        await this.drawLine(0, 0, 0, 10);
        await this.drawLine(0, 10, 10, 10);
        await this.drawLine(10, 10, 10, 0);
        await this.drawLine(10, 0, 0, 0);

    }

    async drawLine(fromX, fromY, toX, toY) {
        if(this.x != fromX || this.y != fromY) {
            await this.goToPos(fromX, fromY);
        }
        this.putDownPen();
        await this.goToPos(toX, toY);
        this.bringUpPen();

    }

    async goToPos(x, y) {
        console.log(`Going to: (${x}, ${y})`);
        let xDist = x - this.x;
        let yDist = y - this.y;

        if(xDist >= 0) {
            this.motorForward(this.xAxis);
        } else {
            this.motorBackward(this.xAxis);
            xDist *= -1
        }

        if(yDist >= 0) {
            this.motorForward(this.yAxis);
        } else {
            this.motorBackward(this.yAxis);
            yDist *= -1
        }

        // console.log(this.gridSize * xDist);
        this.stopMotor(this.xAxis, this.gridSize * xDist);
        this.stopMotor(this.yAxis, this.gridSize * yDist);

        await this.setup.timeout(1000);

        this.x = x;
        this.y = y;
    }

    //basic motor functions
    async stopMotor(motor, time = 0) {
        await this.setup.updateMotorVelocity(0, motor, time);
    }

    async motorForward(motor, time = 0) {
        await this.setup.updateMotorVelocity(this.speed, motor, time);
    }

    async motorBackward(motor, time = 0) {
        await this.setup.updateMotorVelocity(-this.speed, motor, time);
    }

    async putDownPen() {
        console.log('Pen down');
    }

    async bringUpPen() {
        console.log('Pen up');
    }
}

module.exports = Plotter;