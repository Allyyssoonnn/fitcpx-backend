import { credentials } from "@grpc/grpc-js";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { CompressionAlgorithm } from "@opentelemetry/otlp-exporter-base";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

const options = {
   url: "grpc://opentelemetry-collector:4317",
   compression: CompressionAlgorithm.GZIP,
   credentials: credentials.createInsecure(),
};
const metricExporter = new OTLPMetricExporter(options);

const traceExporter = new OTLPTraceExporter(options);

const metricReader = new PeriodicExportingMetricReader({
   exporter: metricExporter,
   // exporter: new ConsoleMetricExporter(),
   exportIntervalMillis: Number(30000),
   exportTimeoutMillis: Number(30000),
});

const sdk = new NodeSDK({
   metricReader,
   traceExporter,
   instrumentations: [getNodeAutoInstrumentations({})],
});

process.on("beforeExit", async () => {
   await sdk.shutdown();
});

sdk.start();

export {};
