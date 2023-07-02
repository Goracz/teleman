import { ResponseInfo } from '../channels/ResponseInfo';
import { LaunchPoint } from './LaunchPoint';
import { LaunchPointsCaseDetail } from './LaunchPointsCaseDetail';

export interface LaunchPoints extends ResponseInfo {
    launchPoints: LaunchPoint[];
    caseDetail: LaunchPointsCaseDetail;
};
