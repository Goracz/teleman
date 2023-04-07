import * as client from "prom-client";

// Enable the default metrics
client.collectDefaultMetrics();

const defaultLabels = { application: "app-interface" };
client.register.setDefaultLabels(defaultLabels);

export default client;
