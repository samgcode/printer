var phidget22 = require('phidget22');

var SERVER_PORT = 5661;

var xAxis = new phidget22.DCMotor();
var yAxis = new phidget22.DCMotor();

async function main() {

	if (process.argv.length != 3) {
		console.log('usage: node printer.js <server address>');
		process.exit(1);
	}
	var hostname = process.argv[2];

	console.log('connecting to:' + hostname);
    var conn = new phidget22.Connection(SERVER_PORT, hostname, { name: 'Server Connection', passwd: '' });
    try {
        await conn.connect();
        await setupMotorFunctions();
        await initMotors();
        start();
    } catch(err) {
        console.error('Error running example:', err.message);
        process.exit(1);
    }
}

//<DCMotor functions>

function updateMotorVelocity(targetVelocity, motor) {
	motor.setTargetVelocity(targetVelocity);
}

function motorAttachHandler(ch) {
	console.log(ch + ' attached');
}

function motorDetachHandler(ch) {
	console.log(ch + ' detached');
}

function onVelocityUpdate(velocity) {
	// console.log('velocity:' + velocity + ' (' + this.getVelocity() + ')');
}

function onBackEMFChange(backEMF) {
	console.log('backEMF:' + backEMF + ' (' + this.getBackEMF() + ')');
}

function onBrakingStrengthUpdate(brakingStrength) {
	console.log('brakingStrength:' + brakingStrength + ' (' + this.getBrakingStrength() + ')');
}

function onError(code, description) {
	console.log('Code: ' + code)
	console.log('Description: ' + description)
}

function motorOpen(ch) {
	console.log('channel open');
}

function motorOpenError(err) {
	console.log('error');
	console.log('failed to open the channel:' + err);
}

//</DCMotor functions>

async function setupMotorFunctions() {

    console.log('connected to server');

    //setup ports
    xAxis.setChannel(0);
    xAxis.setHubPort(1);

    yAxis.setChannel(1);
    yAxis.setHubPort(1);

    //set xAxis functions
	xAxis.onAttach = motorAttachHandler;
    xAxis.onDetach = motorDetachHandler;
    xAxis.onError = onError;

	xAxis.onVelocityUpdate = onVelocityUpdate;
	xAxis.onBackEMFChange = onBackEMFChange;
	xAxis.onBrakingStrengthUpdate = onBrakingStrengthUpdate;

    try {
        await xAxis.open();
        await motorOpen
    } catch(err) {
        motorOpenError(err);
    }

    //set yAxis functions
	yAxis.onAttach = motorAttachHandler;
  	yAxis.onDetach = motorDetachHandler;
    yAxis.onError = onError;

	yAxis.onVelocityUpdate = onVelocityUpdate;
	yAxis.onBackEMFChange = onBackEMFChange;
	yAxis.onBrakingStrengthUpdate = onBrakingStrengthUpdate;

    try {
        await yAxis.open();
        await motorOpen
    } catch(err) {
        motorOpenError(err);
    }

}

async function initMotors() {
    updateMotorVelocity(0, xAxis);
    updateMotorVelocity(0, yAxis);

    xAxis.setAcceleration(100);
    yAxis.setAcceleration(100);
}

const speed = 0.5;

const rows = 20;
const cols = 8;

let image = new Array(rows);

async function start() {
    createImage();
    for(let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            await oneSpace();
            console.log(image[row][col])
            await timeout(300);
        }
        console.log('');
        await nextRow();
    }
    await yToStart();
}

function createImage() {
    for(let row = 0; row < rows; row++) {
        image[row] = new Array(cols);
        for (let col = 0; col < cols; col++) {
            image[row][col] = Math.floor(Math.random() * 2);
        }
    }
    console.log(image);
}


//move over by 1 space
async function oneSpace() {
    motorForward(xAxis);
    await sleep(stopMotor, 50, xAxis);
    return;
}

//move down by 1 and reset the x axis
async function nextRow() {
    motorForward(yAxis);
    await sleep(stopMotor, 25, yAxis);
    await xToStart();
}

//basic motor functions
function stopMotor(motor) {
    updateMotorVelocity(0, motor);
}

function motorForward(motor) {
    updateMotorVelocity(speed, motor);
}

function motorBackward(motor) {
    updateMotorVelocity(-speed, motor);
}

//helper movement functions
async function xToEnd() {
    motorForward(xAxis);
    await sleep(stopMotor, 600, xAxis);
    return;
}

async function xToStart() {
    motorBackward(xAxis);
    await sleep(stopMotor, 600, xAxis);
    return;
}

async function yToEnd() {
    motorForward(yAxis);
    await sleep(stopMotor, 700, yAxis);
    return;
}

async function yToStart() {
    motorBackward(yAxis);
    await sleep(stopMotor, 700, yAxis);
    return;
}


//promise based setTimeout replacment
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, time, ...args) {
    await timeout(time);
    return fn(...args);
}

//starts all the code
console.log('connecting...');

if (require.main === module) {
    main();
}