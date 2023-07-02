import { Kafka, Producer } from 'kafkajs';

import { Meta } from '../constants/meta';
import config from '../environments/environment';
import { logger } from './logger';

export const initializeKafka = (): Producer => {
    const kafka: Kafka = new Kafka({
        clientId: Meta.serviceId,
        brokers: config.brokers,
    });
    const producer: Producer = kafka.producer();
    producer.connect().then(() => logger.info("Connected to Message Queue."));
    return producer;
};

export default {
    initializeKafka,
};
