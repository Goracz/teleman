import { ProgramIcon } from './ProgramIcon';
import { ProgramTitle as ValueWithLang } from './ProgramTitle';

export interface Program {
    site: string;
    channel: string;
    titles: ValueWithLang[];
    sub_titles: ValueWithLang[];
    descriptions: ValueWithLang[];
    icon: ProgramIcon;
    episodeNumbers: unknown[];
    date: string;
    start: string;
    stop: string;
    urls: unknown[];
    ratings: unknown[];
    categories: ValueWithLang[];
    directors: unknown[];
    actors: unknown[];
    writers: unknown[];
    adapters: unknown[];
    producers: unknown[];
    composers: unknown[];
    editors: unknown[];
    presenters: unknown[];
    commentators: unknown[];
    guests: unknown[];
};
