import { writeFileSync, readFileSync } from 'node:fs'
import Parser from 'rss-parser'

const parser = new Parser({
  headers: {
    Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
  },
})

;(async () => {
  try {
    // 1. 티스토리 RSS 피드 가져오기
    const feed = await parser.parseURL('https://yeneua.tistory.com/rss')

    // 2. 새로운 블로그 포스트 리스트 생성 (HTML 형태)
    let blogList = '<ul>\n'
    const postCount = Math.min(feed.items.length, 5) // 최신글 5개
    for (let i = 0; i < postCount; i++) {
      const { title, link } = feed.items[i]
      blogList += `  <li><a href='${link}' target='_blank'>${title}</a></li>\n`
    }
    blogList += '</ul>'

    // 3. 기존 README.md 파일 읽기
    const readmePath = 'README.md'
    const readmeContent = readFileSync(readmePath, 'utf8')

    // 4. 태그 사이의 내용을 블로그 리스트로 교체 (정규표현식 사용)
    const startTag = ''
    const endTag = ''
    const regex = new RegExp(`${startTag}[\\s\\S]*${endTag}`, 'g')

    const newReadmeContent = readmeContent.replace(
      regex,
      `${startTag}\n${blogList}\n${endTag}`
    )

    // 5. 수정된 내용으로 README.md 덮어쓰기
    writeFileSync(readmePath, newReadmeContent, 'utf8')
    console.log('✅ 블로그 포스트 부분만 업데이트 완료!')
  } catch (error) {
    console.error('❌ 업데이트 중 에러 발생:', error)
  }
})()
