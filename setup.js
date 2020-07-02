const phidget22 = require('phidget22');

class PhidgetController {
    constructor() {
        this.SERVER_PORT = 5661;

        this.xAxis = new phidget22.DCMotor();
        this.yAxis = new phidget22.DCMotor();

        this.attachedMotors = 0;
        this.motorsAttached = false;
    }

    async init() {

        if (process.argv.length != 3) {
            console.log('usage: node runFile.js <server address>');
            process.exit(1);
        }
        var hostname = process.argv[2];

        console.log('connecting to:' + hostname);
        var conn = new phidget22.Connection(this.SERVER_PORT, hostname, { name: 'Server Connection', passwd: '' });
        try {
            await conn.connect();
            await this.setupMotorFunctions();
            await this.initMotors();
            await this.timeout(1000);
        } catch(err) {
            console.error('Error running example:', err.message);
            process.exit(1);
        }

    }

    //<DCMotor functions>

    async updateMotorVelocity(targetVelocity, motor, time) {
        await this.sleep(this.setMotorTargetVelocity, time, targetVelocity, motor); 
    }

    setMotorTargetVelocity(targetVelocity, motor) {
        motor.setTargetVelocity(targetVelocity);
    }

    

    motorAttachHandler(ch) {
        console.log(ch + ' attached');
    }

    motorDetachHandler(ch) {
        console.log(ch + ' detached');
    }

    onVelocityUpdate(velocity) {
        // console.log('velocity:' + velocity + ' (' + this.getVelocity() + ')');
    }

    onBackEMFChange(backEMF) {
        console.log('backEMF:' + backEMF + ' (' + this.getBackEMF() + ')');
    }

    onBrakingStrengthUpdate(brakingStrength) {
        console.log('brakingStrength:' + brakingStrength + ' (' + this.getBrakingStrength() + ')');
    }

    onError(code, description) {
        console.log('Code: ' + code)
        console.log('Description: ' + description)
    }

    motorOpen(ch) {
        console.log('channel open');
    }

    motorOpenError(err) {
        console.log('error');
        console.log('failed to open the channel:' + err);
    }

    //</DCMotor functions>

    async setupMotorFunctions() {

        console.log('connected to server');

        //setup ports
        this.xAxis.setChannel(0);
        this.xAxis.setHubPort(1);

        this.yAxis.setChannel(1);
        this.yAxis.setHubPort(1);

        //set this.xAxis functions
        this.xAxis.onAttach = this.motorAttachHandler;
        this.xAxis.onDetach = this.motorDetachHandler;
        this.xAxis.onError = this.onError;

        this.xAxis.onVelocityUpdate = this.onVelocityUpdate;
        this.xAxis.onBackEMFChange = this.onBackEMFChange;
        this.xAxis.onBrakingStrengthUpdate = this.onBrakingStrengthUpdate;

        try {
            await this.xAxis.open();
            await this.motorOpen
        } catch(err) {
            this.motorOpenError(err);
        }

        //set this.yAxis functions
        this.yAxis.onAttach = this.motorAttachHandler;
        this.yAxis.onDetach = this.motorDetachHandler;
        this.yAxis.onError = this.onError;

        this.yAxis.onVelocityUpdate = this.onVelocityUpdate;
        this.yAxis.onBackEMFChange = this.onBackEMFChange;
        this.yAxis.onBrakingStrengthUpdate = this.onBrakingStrengthUpdate;

        try {
            await this.yAxis.open();
            await this.motorOpen
        } catch(err) {
            this.motorOpenError(err);
        }

    }

    async initMotors() {
        this.updateMotorVelocity(0, this.xAxis);
        this.updateMotorVelocity(0, this.yAxis);

        this.xAxis.setAcceleration(100);
        this.yAxis.setAcceleration(100);
    }

    //promise based setTimeout replacment
    async timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async sleep(fn, time, ...args) {
        await this.timeout(time);
        return fn(...args);
    }
}

module.exports = PhidgetController;