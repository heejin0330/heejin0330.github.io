/**
 * 메인 애플리케이션 - 게시글 목록 렌더링
 */
(function () {
  let allPosts = [];
  let activeTag = null;

  // DOM 요소
  const postsList = document.getElementById('posts-list');
  const tagFilters = document.getElementById('tag-filters');
  const noResults = document.getElementById('no-results');
  const loading = document.getElementById('loading');

  // posts.json 로드
  async function loadPosts() {
    try {
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }
      allPosts = await response.json();
      
      // 검색 모듈에 데이터 전달
      if (typeof window.initSearch === 'function') {
        window.initSearch(allPosts, renderPosts);
      }
      
      renderPosts(allPosts);
      renderTagFilters();
      hideLoading();
    } catch (error) {
      console.error('게시글 로드 실패:', error);
      showError();
    }
  }

  // 게시글 목록 렌더링
  function renderPosts(posts) {
    if (!postsList) return;

    if (posts.length === 0) {
      postsList.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    postsList.innerHTML = posts.map(post => `
      <article class="post-card">
        <h2 class="post-card-title">
          <a href="post.html?file=${encodeURIComponent(post.file)}">${escapeHtml(post.title)}</a>
        </h2>
        <div class="post-card-meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          ${post.category ? `<span class="post-category">${escapeHtml(post.category)}</span>` : ''}
        </div>
        ${post.excerpt ? `<p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>` : ''}
        ${post.tags && post.tags.length > 0 ? `
          <div class="post-card-tags">
            ${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    `).join('');
  }

  // 태그 필터 렌더링
  function renderTagFilters() {
    if (!tagFilters) return;

    // 모든 태그 수집 및 카운트
    const tagCount = {};
    allPosts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });

    // 태그가 없으면 필터 숨김
    const tags = Object.keys(tagCount).sort();
    if (tags.length === 0) {
      tagFilters.style.display = 'none';
      return;
    }

    tagFilters.innerHTML = tags.map(tag => `
      <button class="tag-filter" data-tag="${escapeHtml(tag)}">
        ${escapeHtml(tag)} (${tagCount[tag]})
      </button>
    `).join('');

    // 태그 클릭 이벤트
    tagFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag-filter')) {
        const tag = e.target.dataset.tag;
        
        // 같은 태그 클릭 시 필터 해제
        if (activeTag === tag) {
          activeTag = null;
          e.target.classList.remove('active');
          renderPosts(allPosts);
        } else {
          // 새 태그 필터 적용
          activeTag = tag;
          document.querySelectorAll('.tag-filter').forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');
          
          const filtered = allPosts.filter(post => 
            post.tags && post.tags.includes(tag)
          );
          renderPosts(filtered);
        }
      }
    });
  }

  // 로딩 숨기기
  function hideLoading() {
    if (loading) loading.style.display = 'none';
  }

  // 에러 표시
  function showError() {
    hideLoading();
    if (postsList) {
      postsList.innerHTML = `
        <div class="no-results">
          게시글을 불러오는 데 실패했습니다.<br>
          잠시 후 다시 시도해주세요.
        </div>
      `;
    }
  }

  // 날짜 포맷
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // HTML 이스케이프
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 외부에서 접근 가능하도록 전역 함수로 노출
  window.filterPostsByTag = function(tag) {
    if (!tag) {
      renderPosts(allPosts);
      return;
    }
    const filtered = allPosts.filter(post => 
      post.tags && post.tags.includes(tag)
    );
    renderPosts(filtered);
  };

  // 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPosts);
  } else {
    loadPosts();
  }
})();

