---
title: '블로그에 오신 것을 환영합니다!'
date: 2025-11-28
tags: ['블로그', '시작하기', 'GitHub Pages']
category: '공지사항'
description: '첫 번째 게시글입니다. 블로그 사용법을 알아보세요.'
---

# 안녕하세요! 👋

GitHub Pages로 만든 정적 블로그에 오신 것을 환영합니다.

## 블로그 특징

이 블로그는 다음과 같은 기능을 제공합니다:

- ☀️ **다크/라이트 모드** - 우측 상단 버튼으로 전환
- 🔍 **검색 기능** - 제목, 태그, 내용으로 검색
- 🏷️ **태그 필터** - 태그별로 게시글 필터링
- 💬 **Giscus 댓글** - GitHub Discussions 기반 댓글
- 📱 **반응형 디자인** - 모바일에서도 깔끔하게

## 게시글 작성 방법

`pages/` 폴더에 `.md` 파일을 만들면 됩니다.

### Front Matter 예시

```yaml
---
title: '게시글 제목'
date: 2025-11-28
tags: ['태그1', '태그2']
category: '카테고리'
description: '게시글 설명'
---
```

### 마크다운 문법

일반적인 마크다운 문법을 모두 지원합니다:

- **굵게**, *기울임*, ~~취소선~~
- [링크](https://github.com)
- 이미지, 표, 인용문 등

## 코드 하이라이팅

다양한 프로그래밍 언어의 코드 하이라이팅을 지원합니다.

### JavaScript

```javascript
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
}

greet('방문자');
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))
```

### CSS

```css
.post-card {
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
}
```

## 인용문

> "좋은 코드는 그 자체로 최고의 문서가 된다."
> — Steve McConnell

## 표

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 파싱 | marked.js 사용 | ✅ |
| 코드 하이라이팅 | Prism.js 사용 | ✅ |
| 댓글 시스템 | Giscus 연동 | ✅ |
| 검색 기능 | 클라이언트 사이드 | ✅ |

## 다음 단계

1. `js/post-loader.js`에서 Giscus 설정 업데이트
2. 새 게시글을 `pages/` 폴더에 추가
3. Git commit & push
4. GitHub Pages에서 자동 배포 확인

즐거운 블로깅 되세요! 🎉

