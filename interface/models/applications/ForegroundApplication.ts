import { ResponseInfo } from '../channels/ResponseInfo';
import { WebOSApplication } from './WebOSApplication';

export interface ForegroundApplication extends ResponseInfo {
    appId: WebOSApplication;
    processId: string;
    windowId: string;
};
