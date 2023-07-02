import { ApplicationWindowGroupClientInfo } from './ApplicationWindowGroupClientInfo';
import { ApplicationWindowGroupOwnerInfo } from './ApplicationWindowGroupOwnerInfo';

export interface ApplicationWindowGroup {
    owner: boolean;
    name: string;
    clientInfo: ApplicationWindowGroupClientInfo;
    ownerInfo: ApplicationWindowGroupOwnerInfo;
};
