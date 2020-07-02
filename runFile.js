const Setup = require('./setup.js');
let setup = new Setup();

setup.main()
.catch((err) => {
    throw err;
});

const Printer = require('./printer');
const printer = new Printer(setup);

printer.start();