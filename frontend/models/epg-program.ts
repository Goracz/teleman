import { EPGProgramDetail } from './epg-program-detail';

export interface EPGProgram {
  start: string;
  stop: string;
  channel: string;
  title: EPGProgramDetail;
  desc?: EPGProgramDetail;
}
