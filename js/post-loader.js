/**
 * 게시글 상세 페이지 - 마크다운 로딩 및 파싱
 */
(function () {
  // URL에서 파일명 가져오기
  function getFileFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('file');
  }

  // Front Matter 파싱
  function parseFrontMatter(content) {
    // UTF-8 BOM 제거
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }

    const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) {
      return { metadata: {}, content: content };
    }

    const frontMatter = match[1];
    const postContent = match[2];
    const metadata = {};

    // Front Matter 라인 파싱
    const lines = frontMatter.split(/\r?\n/);
    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value.slice(1, -1).split(',').map(tag => 
              tag.trim().replace(/^['"]|['"]$/g, '')
            );
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata, content: postContent };
  }

  // 마크다운을 HTML로 변환
  function renderMarkdown(content) {
    if (typeof marked === 'undefined') {
      console.error('marked.js가 로드되지 않았습니다.');
      return content;
    }

    // marked 설정
    marked.setOptions({
      gfm: true,
      breaks: true,
      highlight: function (code, lang) {
        if (typeof Prism !== 'undefined' && lang && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      }
    });

    return marked.parse(content);
  }

  // 게시글 메타 정보 렌더링
  function renderMeta(metadata) {
    const titleEl = document.getElementById('post-title');
    const dateEl = document.getElementById('post-date');
    const categoryEl = document.getElementById('post-category');
    const tagsEl = document.getElementById('post-tags');

    if (titleEl && metadata.title) {
      titleEl.textContent = metadata.title;
      document.title = `${metadata.title} - heejin0330 Blog`;
    }

    if (dateEl && metadata.date) {
      const date = new Date(metadata.date);
      dateEl.textContent = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      dateEl.setAttribute('datetime', metadata.date);
    }

    if (categoryEl && metadata.category) {
      categoryEl.textContent = metadata.category;
    }

    if (tagsEl && metadata.tags && Array.isArray(metadata.tags)) {
      tagsEl.innerHTML = metadata.tags.map(tag => 
        `<span class="tag">${escapeHtml(tag)}</span>`
      ).join('');
    }
  }

  // HTML 이스케이프
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Giscus 댓글 로드
  function loadGiscus() {
    const container = document.getElementById('giscus-container');
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'heejin0330/heejin0330.github.io');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // ⚠️ 실제 값으로 교체 필요
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // ⚠️ 실제 값으로 교체 필요
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    container.appendChild(script);
  }

  // 게시글 로드
  async function loadPost() {
    const filename = getFileFromUrl();
    const contentEl = document.getElementById('post-content');

    if (!filename) {
      if (contentEl) {
        contentEl.innerHTML = '<p>게시글을 찾을 수 없습니다. <a href="index.html">목록으로 돌아가기</a></p>';
      }
      return;
    }

    try {
      const response = await fetch(`pages/${filename}`);
      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }

      const rawContent = await response.text();
      const { metadata, content } = parseFrontMatter(rawContent);

      // 메타 정보 렌더링
      renderMeta(metadata);

      // 마크다운 → HTML 변환
      const html = renderMarkdown(content);
      if (contentEl) {
        contentEl.innerHTML = html;
      }

      // 코드 하이라이팅 재적용
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
      }

      // Giscus 댓글 로드
      loadGiscus();

    } catch (error) {
      console.error('게시글 로드 실패:', error);
      if (contentEl) {
        contentEl.innerHTML = `
          <p>게시글을 불러오는 데 실패했습니다.</p>
          <p><a href="index.html">목록으로 돌아가기</a></p>
        `;
      }
    }
  }

  // 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPost);
  } else {
    loadPost();
  }
})();

