import { Application } from 'express';

import { ResponseInfo } from '../channels/ResponseInfo';

export interface ApplicationList extends ResponseInfo {
    apps: Application[];
};
