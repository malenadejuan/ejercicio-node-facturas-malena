const { program } = require("commander");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.parse(process.arg);

const options = program.opts();
module.exports = options;
