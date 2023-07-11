import { ElectronicProgramGuideChannel } from './electronic-program-guide-channel';
import { ElectronicProgramGuideProgramme } from './electronic-program-guide-programme';

export interface ElectronicProgramGuide {
    channels: ElectronicProgramGuideChannel[];
    programmes:ElectronicProgramGuideProgramme[];
};
