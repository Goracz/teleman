import { getSpan } from "@opentelemetry/api/build/src/trace/context-utils";

const { createLogger, format, transports } = require("winston");
const { context } = require("@opentelemetry/api");

const { combine, timestamp, printf, json, errors } = format;

const traceIdFormat = format((info: any) => {
  const span = getSpan(context.active());
  if (span) {
    const traceId = span.spanContext().traceId;
    const spanId = span.spanContext().spanId;
    const traceFlags = span.spanContext().traceFlags;
    info.message = `trace_id=${traceId} span_id=${spanId} trace_flags=${traceFlags} ${info.message}`;
  }
  return info;
});

const jsonFormat = format((info: any) => {
  const time = info.timestamp;
  const type = info.level;
  const msg = info.message;

  return {
    time,
    type,
    msg,
  };
});

export const logger = createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true }),
    traceIdFormat(),
    json(),
    jsonFormat()
  ),
  transports: [new transports.Console()],
});
