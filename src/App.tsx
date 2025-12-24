import { useState, useEffect } from 'react'
import './App.css'

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

function App() {
  const [poetry, setPoetry] = useState<PoetryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoetry = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 第一步：获取token
        const tokenResponse = await fetch('https://v2.jinrishici.com/token')
        const tokenData: TokenResponse = await tokenResponse.json()
        
        if (tokenData.status !== 'success') {
          throw new Error('获取token失败')
        }
        
        const token = tokenData.data
        
        // 第二步：使用token获取诗词
        const sentenceResponse = await fetch('https://v2.jinrishici.com/sentence', {
          headers: {
            'X-User-Token': token
          }
        })
        
        const sentenceData: SentenceResponse = await sentenceResponse.json()
        
        if (sentenceData.status !== 'success') {
          throw new Error('获取诗词失败')
        }
        
        setPoetry(sentenceData.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    fetchPoetry()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">正在加载今日诗词...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">加载失败: {error}</div>
      </div>
    )
  }

  if (!poetry) {
    return (
      <div className="container">
        <div className="error">暂无诗词数据</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="poetry-card">
        <h1 className="title">今日诗词推荐</h1>
        
        <div className="today-sentence">
          <div className="sentence-content">{poetry.content}</div>
        </div>

        <div className="origin-info">
          <h2 className="origin-title">《{poetry.origin.title}》</h2>
          <div className="origin-meta">
            <span className="dynasty">{poetry.origin.dynasty}</span>
            <span className="author">· {poetry.origin.author}</span>
          </div>
          
          <div className="origin-content">
            {poetry.origin.content.map((line, index) => (
              <div key={index} className="poem-line">{line}</div>
            ))}
          </div>
        </div>

        {poetry.matchTags && poetry.matchTags.length > 0 && (
          <div className="tags">
            <span className="tag-label">标签：</span>
            {poetry.matchTags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
