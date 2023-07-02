import { Producer } from 'kafkajs';
import lgtv from 'lgtv2';

import { resetConnection } from '../';
import { BrokerTopics } from '../constants/broker-topics';
import { WebOSStreams } from '../constants/webos-streams';
import config from '../environments/environment';
import { CurrentChannel } from '../models/channels/CurrentChannel';
import { logger } from './logger';

export const registerEventListeners = (connection: lgtv, producer: Producer): void => {
    reconnect();

    const onChannelChange = async (_: any, res: CurrentChannel) => {
        logger.debug(`Channel changed to: ${res.channelName}.`);
        await producer.send({
            topic: BrokerTopics.CHANNEL_CHANGE,
            messages: [{ value: JSON.stringify(res) }],
        });
    };

    const onVolumeChange = async (_: any, res: any) => {
        logger.debug(`Volume changed to: ${res.volumeStatus.volume}`);
        await producer.send({
            topic: BrokerTopics.VOLUME_CHANGE,
            messages: [{ value: JSON.stringify(res) }],
        });
    };

    const onPowerStateChange = async (_: any, res: any) => {
        logger.debug(`Power state changed to: ${JSON.stringify(res)}.`);
        await producer.send({
            topic: BrokerTopics.POWER_STATE_CHANGE,
            messages: [{ value: JSON.stringify(res) }],
        });
    };

    const onForegroundAppChange = async (_: any, res: any) => {
        logger.debug(`Foreground app changed to: ${JSON.stringify(res)}.`);
        await producer.send({
            topic: BrokerTopics.FOREGROUND_APP_CHANGE,
            messages: [{ value: JSON.stringify(res) }],
        });
    };

    connection.on("prompt", () => {
        console.log("prompt requested...");
    });

    connection.on("error", (err: any) => {
        logger.error(`Error received from WebOS: ${err}.`);
        reconnect().then(() => logger.info("Re-initiated connection to TV."));
    });

    connection.on("connect", () => {
        logger.info("Connected to TV.");

        connection.subscribe(WebOSStreams.CHANNEL_CHANGE_STREAM, onChannelChange);
        logger.debug(`Listening to channel changes...`);

        connection.subscribe(WebOSStreams.VOLUME_CHANGE_STREAM, onVolumeChange);
        logger.debug(`Listening to volume changes...`);

        connection.subscribe(
            WebOSStreams.POWER_STATE_CHANGE_STREAM,
            onPowerStateChange
        );
        logger.debug(`Listening to power state changes...`);

        connection.subscribe(
            WebOSStreams.FOREGROUND_APP_CHANGE_STREAM,
            onForegroundAppChange
        );
        logger.debug(`Listening to foreground application changes...`);
    });
};

export const reconnect = async (): Promise<void> => {
    let connection: lgtv | null = null;
    try {
        let numberOfAttempts = 1;
        const initConnection = setInterval(() => {
            logger.info(`Reconnecting to TV... (${numberOfAttempts}. attempt)`);
            connection = lgtv(config.connectionConfig);
            numberOfAttempts += 1;
        }, 3000);
        clearInterval(initConnection);
        if (connection) resetConnection(connection);
    } catch (err: any) {
        logger.error(`Could not reconnect to TV: ${err.message}.`);
    }
};

export default {
    registerEventListeners,
    reconnect,
};
