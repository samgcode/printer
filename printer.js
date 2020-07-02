class Printer {
    constructor(setup) {
        this.setup = setup;

        this.xAxis = setup.xAxis;
        this.yAxis = setup.yAxis;

        this.speed = 0.5;

        this.rows = 20;
        this.cols = 8;
    
        this.image = new Array(this.rows);
    }


    async start() {
        console.log('starting print');
        this.createImage();
        for(let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                await this.oneSpace();
                console.log(this.image[row][col])
                await this.setup.timeout(300);
            }
            console.log('');
            await this.nextRow();
        }
        await this.yToStart();
    }

    createImage() {
        for(let row = 0; row < this.rows; row++) {
            this.image[row] = new Array(this.cols);
            for (let col = 0; col < this.cols; col++) {
                this.image[row][col] = Math.floor(Math.random() * 2);
            }
        }
        console.log(this.image);
    }


    //move over by 1 space
    async oneSpace() {
        try {
            this.motorForward(this.xAxis, 0);
            await this.stopMotor(this.xAxis, 50);
        } catch(err) {
            console.log(err);
        }
        return;
    }

    //move down by 1 and reset the x axis
    async nextRow() {
        this.motorForward(this.yAxis);
        await this.stopMotor(this.yAxis, 25);
        await this.xToStart();
    }

    //basic motor functions
    async stopMotor(motor, time) {
        await this.setup.updateMotorVelocity(0, motor, time);
    }

    async motorForward(motor, time) {
        await this.setup.updateMotorVelocity(this.speed, motor, time);
    }

    async motorBackward(motor, time) {
        await this.setup.updateMotorVelocity(-this.speed, motor, time);
    }

    //helper movement functions
    async xToEnd() {
        this.motorForward(this.xAxis, 0);
        await this.stopMotor(this.xAxis, 600);
        return;
    }

    async xToStart() {
        this.motorBackward(this.xAxis, 0);
        await this.stopMotor(this.xAxis, 600);
        return;
    }

    async yToEnd() {
        this.motorForward(this.yAxis, 0);
        await this.stopMotor(this.yAxis, 700);
        return;
    }

    async yToStart() {
        this.motorBackward(this.yAxis, 0);
        await this.stopMotor(this.yAxis, 700);
        return;
    }
}

module.exports = Printer;