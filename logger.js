const { createLogger, format, transports } = require("winston");

const customFormat = format.combine(
    format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
    format.align(),
    format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
);
const defaultOptions = {
    format: customFormat,
};
module.exports = createLogger({
    transports: [
        //new transports.Console(),
        new transports.File({
            filename: "logs/debug.log",
            level: "debug",
            ...defaultOptions,
        }),
        new transports.File({
            filename: "logs/error.log",
            level: "error",
            ...defaultOptions,
        })
    ],
});