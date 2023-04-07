const { Resource } = require("@opentelemetry/resources");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { CollectorTraceExporter } = require("@opentelemetry/exporter-collector");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");

const resourceAttributes = process.env.OTEL_RESOURCE_ATTRIBUTES
  ? Object.fromEntries(
      process.env.OTEL_RESOURCE_ATTRIBUTES.split(",").map((attr) =>
        attr.split("=")
      )
    )
  : {};

const resource = new Resource(resourceAttributes);

const sdk = new NodeSDK({
  resource,
  traceExporter: new CollectorTraceExporter({
    url: "http://tempo:4317",
  }),
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

sdk.start();
module.exports = {
  sdk,
};
