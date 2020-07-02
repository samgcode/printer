async function main() {
    const PhidgetController = require('./setup.js');
    let phidgetController = new PhidgetController();

    await phidgetController.init();

    const Printer = require('./printer');
    const printer = new Printer(phidgetController);

    const Plotter = require('./plotter');
    const plotter = new Plotter(phidgetController);

    plotter.start();
}

main()
.catch((err) => {
    throw err;
});