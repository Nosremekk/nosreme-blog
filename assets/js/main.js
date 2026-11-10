/**
 * Nosreme Blog — JavaScript Principal
 * Puro, leve e sem dependências externas.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Gerenciamento de Tema (Modo Claro / Escuro)
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'nosreme-theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute('title', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro');
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }

  // Ouvinte para preferências do sistema operacional
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --------------------------------------------------------------------------
  // Copiar link do artigo
  // --------------------------------------------------------------------------
  function setupCopyLink() {
    const copyBtn = document.getElementById('copy-link-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Link copiado!</span>
        `;
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('copied');
        }, 2200);
      } catch (err) {
        console.error('Falha ao copiar URL:', err);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Pesquisa Local em JavaScript Puro
  // --------------------------------------------------------------------------
  let searchIndex = null;
  let isFetchingIndex = false;

  async function loadSearchIndex() {
    if (searchIndex || isFetchingIndex) return searchIndex;
    isFetchingIndex = true;
    try {
      // index.json fica na raiz do site
      const response = await fetch('/index.json');
      if (!response.ok) {
        throw new Error('Não foi possível carregar o índice de busca.');
      }
      searchIndex = await response.json();
      return searchIndex;
    } catch (err) {
      console.error('Erro na busca:', err);
      return [];
    } finally {
      isFetchingIndex = false;
    }
  }

  function highlightMatches(text, query) {
    if (!text) return '';
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<mark style="background-color: var(--accent-subtle); color: var(--accent); padding: 0 2px;">$1</mark>');
  }

  function setupSearch() {
    const searchInput = document.getElementById('search-query-input');
    const resultsContainer = document.getElementById('search-results');
    const statusContainer = document.getElementById('search-status');

    if (!searchInput || !resultsContainer) return;

    // Pré-carrega o índice ao focar no campo de busca
    searchInput.addEventListener('focus', () => {
      loadSearchIndex();
    });

    searchInput.addEventListener('input', async (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        resultsContainer.innerHTML = '';
        if (statusContainer) statusContainer.textContent = 'Digite ao menos duas letras para buscar.';
        return;
      }

      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        if (statusContainer) statusContainer.textContent = 'Continue digitando para refinar a busca...';
        return;
      }

      const index = await loadSearchIndex();
      if (!index || index.length === 0) {
        if (statusContainer) statusContainer.textContent = 'Índice de busca indisponível ou vazio.';
        return;
      }

      const results = index.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const summary = (item.summary || '').toLowerCase();
        const content = (item.content || '').toLowerCase();
        const categories = (item.categories || []).join(' ').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();

        return (
          title.includes(query) ||
          summary.includes(query) ||
          content.includes(query) ||
          categories.includes(query) ||
          tags.includes(query)
        );
      });

      if (results.length === 0) {
        if (statusContainer) statusContainer.textContent = `Nenhum artigo encontrado para "${query}".`;
        resultsContainer.innerHTML = '';
        return;
      }

      if (statusContainer) {
        statusContainer.textContent = `${results.length} ${results.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}:`;
      }

      resultsContainer.innerHTML = results
        .map((item) => {
          const highlightedTitle = highlightMatches(item.title, query);
          const snippetSource = item.summary || item.content || '';
          const snippet = snippetSource.length > 200 ? snippetSource.substring(0, 200) + '...' : snippetSource;
          const highlightedSnippet = highlightMatches(snippet, query);
          const dateStr = item.date ? `<span class="meta-item">${item.date}</span>` : '';
          const catStr = item.categories && item.categories.length > 0 ? `<span class="meta-category">${item.categories[0]}</span>` : '';

          return `
            <li class="search-result-item">
              <h3 class="search-result-title">
                <a href="${item.permalink}">${highlightedTitle}</a>
              </h3>
              <div class="post-meta" style="margin-bottom: 0.4rem;">
                ${dateStr}
                ${catStr ? `<span class="meta-separator">•</span>${catStr}` : ''}
              </div>
              <p class="search-result-snippet">${highlightedSnippet}</p>
            </li>
          `;
        })
        .join('');
    });
  }

  // --------------------------------------------------------------------------
  // Inicialização quando o DOM estiver pronto
  // --------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Liga o botão de alternar tema
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    setupCopyLink();
    setupSearch();
  });
})();
