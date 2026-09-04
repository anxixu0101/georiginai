export const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=ux5r7wajftk'

export const SOCIALS = {
  discord: 'https://discord.gg/s8bqAQeaXa',
  x: 'https://x.com/GeOrigin0101',
  instagram: 'https://www.instagram.com/georigin0101/',
  youtube: 'https://www.youtube.com/@GeOriginAi',
} as const

export interface GameInfo {
  title: string
  tag: string
  image: string
}

export const GAMES: GameInfo[] = [
  { title: 'STAR DRIFT', tag: 'SHMUP', image: '/assets/device-yellow-space.jpg' },
  { title: 'PAPER TRAIL', tag: 'RPG', image: '/assets/game-entry.jpg' },
  { title: 'NIGHT TRAIN 04', tag: 'AVG', image: '/assets/game-train.jpg' },
  { title: 'ECLIPSE RACER', tag: 'RACER', image: '/assets/game-gothic.jpg' },
]
