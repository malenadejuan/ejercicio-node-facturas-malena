const { program } = require("commander");

program.option("-p, --puerto <puerto>", "Puerto para el servidor");
program.option("-d, --datos <datos>", "Elegir si los datos vienen de la base de datos o de archivo JSON");
program.parse(process.arg);

const options = program.opts();
module.exports = options;
