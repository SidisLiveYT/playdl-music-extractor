import { YoutubeData, YoutubeStreamOptions } from './Instances'

export function Extractor (
  Query: String,
  YoutubeStreamOptions: YoutubeStreamOptions
): Promise<YoutubeData> | undefined
