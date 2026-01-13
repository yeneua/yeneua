import { writeFileSync, readFileSync } from 'node:fs'
import Parser from 'rss-parser'

const parser = new Parser({
  headers: {
    Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
  },
})

;(async () => {
  try {
    const feed = await parser.parseURL('https://yeneua.tistory.com/rss')

    let blogList = '<ul>\n'
    const postCount = Math.min(feed.items.length, 5)
    for (let i = 0; i < postCount; i++) {
      const { title, link } = feed.items[i]
      blogList += `  <li><a href='${link}' target='_blank'>${title}</a></li>\n`
    }
    blogList += '</ul>'

    const readmePath = 'README.md'
    const readmeContent = readFileSync(readmePath, 'utf8')

    const startTag = '<!-- BLOG_POSTS:START -->'
    const endTag = '<!-- BLOG_POSTS:END -->'

    const regex = new RegExp(`${startTag}[\\s\\S]*${endTag}`, 'g')

    const newReadmeContent = readmeContent.replace(
      regex,
      `${startTag}\n${blogList}\n${endTag}`
    )

    writeFileSync(readmePath, newReadmeContent, 'utf8')
    console.log('블로그 포스트 업데이트 완료')
  } catch (error) {
    console.error('에러 발생:', error)
  }
})()
