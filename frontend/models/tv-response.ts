import { EPGChannel } from './epg-channel';
import { EPGProgram } from './epg-program';

export interface TvResponse {
  channel: EPGChannel[];
  programme: EPGProgram[];
}
