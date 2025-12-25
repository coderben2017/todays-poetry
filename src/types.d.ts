interface PoetryData {
  id: string
  content: string
  popularity: number
  origin: {
    title: string
    dynasty: string
    author: string
    content: string[]
    translate: string[]
  }
  matchTags: string[]
  recommendedReason: string
  cacheAt: string
  token: string
  ipAddress: string
}

interface TokenResponse {
  status: string
  data: string
}

interface SentenceResponse {
  status: string
  data: PoetryData
}
