import { YoutubeData, YoutubeStreamOptions } from './Instances'

export function Extractor(
  Query: String,
  YoutubeStreamOptions: YoutubeStreamOptions,
): Promise<YoutubeData> | undefined

export function StreamDownloader(
  Query: String,
  YoutubeStreamOptions: YoutubeStreamOptions,
): Promise<YoutubeData> | undefined

export function HumanTimeConversion(
  DurationMilliSeconds: Number,
): String | undefined

export function GetLyrics(
  SongConstant: String,
  force: boolean,
  researchCount: Number,
): Promise<String | undefined> | undefined
