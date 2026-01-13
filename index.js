import { writeFileSync, readFileSync } from 'node:fs' // readFileSync 추가
import Parser from 'rss-parser'

// 1. package.json 파일을 읽어서 description 추출
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
const description = packageJson.description

let text = `${description}

## 📕 Latest Blog Posts

`

const parser = new Parser({
  headers: {
    Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
  },
})

;(async () => {
  const feed = await parser.parseURL('https://yeneua.tistory.com/rss')

  text += `<ul>`

  // 게시글 수 체크
  const postCount = Math.min(feed.items.length, 5)

  for (let i = 0; i < postCount; i++) {
    const { title, link } = feed.items[i]
    text += `<li><a href='${link}' target='_blank'>${title}</a></li>`
  }

  text += `</ul>`

  writeFileSync('README.md', text, 'utf8')
  console.log('package.json의 설명을 포함하여 업데이트 완료')
})()
