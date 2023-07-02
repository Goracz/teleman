import { Express } from 'express';

import apps from '../routes/app/apps';
import output from '../routes/media/output';
import playback from '../routes/media/playback';
import volume from '../routes/media/volume';
import info from '../routes/system/info';
import power from '../routes/system/power';
import screen from '../routes/system/screen';
import channels from '../routes/tv/channels';

export const registerRouterHandlers = (app: Express): void => {
    // TV Controls
    app.use("/api/v1/tv/channels", channels);

    // System Controls
    app.use("/api/v1/system/power", power);
    app.use("/api/v1/system/screen", screen);
    app.use("/api/v1/system/info", info);

    // Media Controls
    app.use("/api/v1/media/volume", volume);
    app.use("/api/v1/media/playback", playback);
    app.use("/api/v1/media/output", output);

    // App Controls
    app.use("/api/v1/app", apps);
};

export default {
    registerRouterHandlers,
};
