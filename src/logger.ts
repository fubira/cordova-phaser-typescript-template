import pino from "pino";

const LOG_LEVEL = DEBUG ? "debug" : "error";
const logger: pino.Logger = pino({ name: "app", level: LOG_LEVEL });

export default logger;
