/**
 * 클라이언트 사이드 검색 기능
 */
(function () {
  let searchPosts = [];
  let renderCallback = null;
  let debounceTimer = null;

  const searchInput = document.getElementById('search-input');

  // 검색 초기화 (app.js에서 호출)
  window.initSearch = function (posts, render) {
    searchPosts = posts;
    renderCallback = render;
  };

  // 검색 실행
  function performSearch(query) {
    if (!renderCallback) return;

    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      renderCallback(searchPosts);
      return;
    }

    const results = searchPosts.filter(post => {
      // 제목 검색
      if (post.title && post.title.toLowerCase().includes(trimmedQuery)) {
        return true;
      }
      // 설명 검색
      if (post.description && post.description.toLowerCase().includes(trimmedQuery)) {
        return true;
      }
      // 발췌문 검색
      if (post.excerpt && post.excerpt.toLowerCase().includes(trimmedQuery)) {
        return true;
      }
      // 태그 검색
      if (post.tags && post.tags.some(tag => tag.toLowerCase().includes(trimmedQuery))) {
        return true;
      }
      // 카테고리 검색
      if (post.category && post.category.toLowerCase().includes(trimmedQuery)) {
        return true;
      }
      return false;
    });

    renderCallback(results);
  }

  // 디바운스된 검색
  function debouncedSearch(query) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  }

  // 이벤트 연결
  function init() {
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });

      // Enter 키로 즉시 검색
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(debounceTimer);
          performSearch(e.target.value);
        }
      });
    }
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

