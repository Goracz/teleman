export enum ChannelCategory {
  NewsAndPublicServiceAndCultural = 'NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL',
  Sports = 'SPORTS',
  Lifestyle = 'LIFESTYLE',
  Music = 'MUSIC',
  LocalChannel = 'LOCAL_CHANNEL',
  Adult = 'ADULT',
  MoviesAndSeriesAndEntertainment = 'MOVIES_AND_SERIES_AND_ENTERTAINMENT',
  Educational = 'EDUCATIONAL',
  Kids = 'KIDS',
  Foreign = 'FOREIGN',
  MoviesExtra = 'MOVIES_EXTRA',
  Radio = 'RADIO',
  Various = 'VARIOUS',
  Other = 'OTHER',
}

export const ChannelCategoryLegend = {
  NEWS_AND_PUBLIC_SERVICE_AND_CULTURAL: 'News, Public Service & Cultural',
  SPORTS: 'Sports',
  LIFESTYLE: 'Lifestyle',
  MUSIC: 'Music',
  LOCAL_CHANNEL: 'Local Channel',
  ADULT: 'Adult',
  MOVIES_AND_SERIES_AND_ENTERTAINMENT: 'Movies, Series & Entertainment',
  EDUCATIONAL: 'Educational',
  KIDS: 'Kids',
  FOREIGN: 'Foreign',
  MOVIES_EXTRA: 'Movies Extra',
  RADIO: 'Radio',
  VARIOUS: 'Various',
  OTHER: 'Other',
};

export type ChannelCategoryLegend = keyof typeof ChannelCategoryLegend;
