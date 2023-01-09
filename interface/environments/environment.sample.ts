/**
 * Create an environment.local.ts file in the same directory as this file is in,
 * with the respective data.
 */

/**
 * Required - Your TV's IP address
 */
const tvIpAddress: string = "";
/**
 * Optional - Your TV's MAC address
 */
const tvMacAddress: string = "";
/**
 * Required - Apache Kafka broker's address (IP:PORT)
 */
const brokers: string[] = [];
/**
 * Optional - Your LogDNA configuration
 */
const logDnaIngestionKey = {
  ingestionKey: "",
  host: "",
};

export default {
  tvIpAddress,
  tvMacAddress,
  brokers,
};
