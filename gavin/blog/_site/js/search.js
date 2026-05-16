/**
 * Intelligent Search System
 * Dual-mode: Traditional filters + AI conversational search
 */

// State
let currentMode = 'traditional';
let searchQuery = '';
let activeFilters = {
  categories: [],
  tags: [],
  time: [],
  date: []
};
let sortBy = 'relevance';
let currentPage = 1;
const RESULTS_PER_PAGE = 9;

// AI Chat State
let chatHistory = [];
let currentUseCase = null;

// DOM Elements
const traditionalPanel = document.getElementById('traditionalPanel');
const aiPanel = document.getElementById('aiPanel');
const traditionalModeBtn = document.getElementById('traditionalMode');
const aiModeBtn = document.getElementById('aiMode');

// Initialize
function init() {
  setupModeToggle();
  setupTraditionalSearch();
  setupAIChat();
  renderCategoryFilters();
  renderTagFilters();
  performSearch();
}

// ==================== MODE TOGGLE ====================

function setupModeToggle() {
  traditionalModeBtn.addEventListener('click', () => switchMode('traditional'));
  aiModeBtn.addEventListener('click', () => switchMode('ai'));
}

function switchMode(mode) {
  currentMode = mode;
  
  // Update buttons
  traditionalModeBtn.classList.toggle('active', mode === 'traditional');
  aiModeBtn.classList.toggle('active', mode === 'ai');
  
  // Show/hide panels
  traditionalPanel.style.display = mode === 'traditional' ? 'block' : 'none';
  aiPanel.style.display = mode === 'ai' ? 'block' : 'none';
  
  // Scroll to top of results
  if (mode === 'traditional') {
    traditionalPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==================== TRADITIONAL SEARCH ====================

function setupTraditionalSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const sortSelect = document.getElementById('sortSelect');
  const clearFilters = document.getElementById('clearFilters');
  
  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearch.style.display = searchQuery ? 'block' : 'none';
    currentPage = 1;
    performSearch();
  });
  
  // Clear search
  clearSearch.addEventListener('click', () => {
    searchQuery = '';
    searchInput.value = '';
    clearSearch.style.display = 'none';
    currentPage = 1;
    performSearch();
  });
  
  // Sort
  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    performSearch();
  });
  
  // Clear all filters
  clearFilters.addEventListener('click', () => {
    activeFilters = { categories: [], tags: [], time: [], date: [] };
    searchQuery = '';
    searchInput.value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    currentPage = 1;
    performSearch();
  });
}

function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  container.innerHTML = CATEGORIES.map(cat => `
    <label class="filter-option">
      <input type="checkbox" value="${cat}" data-filter="categories">
      <span class="checkmark"></span>
      <span class="label">${cat}</span>
      <span class="count">${BLOG_DATA.filter(p => p.category === cat).length}</span>
    </label>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', (e) => updateFilter('categories', e.target.value, e.target.checked));
  });
}

function renderTagFilters() {
  const container = document.getElementById('tagFilters');
  container.innerHTML = ALL_TAGS.map(tag => `
    <button class="tag-btn" data-tag="${tag}">${tag}</button>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tag = e.target.dataset.tag;
      const isActive = e.target.classList.contains('active');
      e.target.classList.toggle('active', !isActive);
      updateFilter('tags', tag, !isActive);
    });
  });
}

function updateFilter(filterType, value, isActive) {
  if (isActive) {
    if (!activeFilters[filterType].includes(value)) {
      activeFilters[filterType].push(value);
    }
  } else {
    activeFilters[filterType] = activeFilters[filterType].filter(v => v !== value);
  }
  currentPage = 1;
  performSearch();
}

// Setup time/date filters
document.getElementById('timeFilters').querySelectorAll('input').forEach(input => {
  input.addEventListener('change', (e) => updateFilter('time', e.target.value, e.target.checked));
});

document.getElementById('dateFilters').querySelectorAll('input').forEach(input => {
  input.addEventListener('change', (e) => updateFilter('date', e.target.value, e.target.checked));
});

function performSearch() {
  let results = [...BLOG_DATA];
  
  // Apply text search
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    results = results.filter(post => {
      const searchText = `${post.title} ${post.description} ${post.tags.join(' ')} ${post.category}`.toLowerCase();
      return searchText.includes(query);
    });
  }
  
  // Apply category filter
  if (activeFilters.categories.length > 0) {
    results = results.filter(post => activeFilters.categories.includes(post.category));
  }
  
  // Apply tag filter
  if (activeFilters.tags.length > 0) {
    results = results.filter(post => 
      activeFilters.tags.some(tag => post.tags.includes(tag))
    );
  }
  
  // Apply time filter
  if (activeFilters.time.length > 0) {
    results = results.filter(post => {
      const time = post.readingTime;
      return activeFilters.time.some(filter => {
        if (filter === 'short') return time < 5;
        if (filter === 'medium') return time >= 5 && time <= 10;
        if (filter === 'long') return time > 10;
        return false;
      });
    });
  }
  
  // Apply date filter
  if (activeFilters.date.length > 0) {
    results = results.filter(post => {
      const postDate = new Date(post.date);
      const now = new Date();
      return activeFilters.date.some(filter => {
        if (filter === 'week') {
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          return postDate >= weekAgo;
        }
        if (filter === 'month') {
          const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
          return postDate >= monthAgo;
        }
        if (filter === 'year') {
          return postDate.getFullYear() === now.getFullYear();
        }
        return false;
      });
    });
  }
  
  // Apply sorting
  results = sortResults(results);
  
  // Render results
  renderResults(results);
  renderActiveFilters();
}

function sortResults(results) {
  const sorted = [...results];
  
  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'popular':
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'readingTime':
      sorted.sort((a, b) => a.readingTime - b.readingTime);
      break;
    default: // relevance
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        sorted.sort((a, b) => {
          const aScore = calculateRelevanceScore(a, query);
          const bScore = calculateRelevanceScore(b, query);
          return bScore - aScore;
        });
      }
  }
  
  return sorted;
}

function calculateRelevanceScore(post, query) {
  let score = 0;
  const titleLower = post.title.toLowerCase();
  const descLower = post.description.toLowerCase();
  
  if (titleLower.includes(query)) score += 10;
  if (descLower.includes(query)) score += 5;
  
  post.tags.forEach(tag => {
    if (tag.toLowerCase().includes(query)) score += 3;
  });
  
  if (post.category.toLowerCase().includes(query)) score += 4;
  
  return score;
}

function renderResults(results) {
  const container = document.getElementById('resultsGrid');
  const countEl = document.getElementById('resultsCount');
  const pagination = document.getElementById('pagination');
  
  // Update count
  countEl.textContent = `${results.length} article${results.length !== 1 ? 's' : ''} found`;
  
  // Pagination
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, startIndex + RESULTS_PER_PAGE);
  
  // Render cards
  if (paginatedResults.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p>No articles found matching your criteria.</p>
        <button class="btn btn-secondary" onclick="clearAllFilters()">Clear All Filters</button>
      </div>
    `;
  } else {
    container.innerHTML = paginatedResults.map(post => renderBlogCard(post)).join('');
  }
  
  // Render pagination
  renderPagination(totalPages);
}

function renderBlogCard(post) {
  const difficultyClass = `difficulty-${post.difficulty}`;
  const difficultyLabel = post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1);
  
  return `
    <article class="blog-card" data-category="${post.category}" data-difficulty="${post.difficulty}">
      <a href="/posts/${post.slug}/" class="card-image-link">
        <div class="card-image">
          <img src="${post.image || '/assets/images/hero-bg.png'}" alt="${post.title}" loading="lazy">
        </div>
      </a>
      <div class="card-content">
        <div class="card-meta">
          <span class="category-badge">${post.category}</span>
          <span class="difficulty-badge ${difficultyClass}">${difficultyLabel}</span>
        </div>
        <h3><a href="/posts/${post.slug}/">${post.title}</a></h3>
        <p class="card-description">${post.description}</p>
        <div class="card-tags">
          ${post.tags.slice(0, 4).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="reading-time">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${post.readingTime} min read
          </span>
          <span class="date">${formatDate(post.date)}</span>
        </div>
      </div>
    </article>
  `;
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  if (currentPage > 1) {
    html += `<button class="page-btn" data-page="${currentPage - 1}">← Previous</button>`;
  }
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button class="page-btn active">${i}</button>`;
    } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="page-btn" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span class="page-ellipsis">...</span>`;
    }
  }
  
  // Next button
  if (currentPage < totalPages) {
    html += `<button class="page-btn" data-page="${currentPage + 1}">Next →</button>`;
  }
  
  container.innerHTML = html;
  
  // Add event listeners
  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentPage = parseInt(e.target.dataset.page);
      performSearch();
      document.getElementById('resultsGrid').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderActiveFilters() {
  const container = document.getElementById('activeFilters');
  const allActive = [
    ...activeFilters.categories.map(c => ({ type: 'categories', value: c, label: c })),
    ...activeFilters.tags.map(t => ({ type: 'tags', value: t, label: t })),
    ...activeFilters.time.map(t => ({ type: 'time', value: t, label: getTimeLabel(t) })),
    ...activeFilters.date.map(d => ({ type: 'date', value: d, label: getDateLabel(d) }))
  ];
  
  if (allActive.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = allActive.map(filter => `
    <span class="active-filter">
      ${filter.label}
      <button data-type="${filter.type}" data-value="${filter.value}" aria-label="Remove filter">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </span>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type;
      const value = e.currentTarget.dataset.value;
      
      // Update state
      activeFilters[type] = activeFilters[type].filter(v => v !== value);
      
      // Uncheck checkbox if exists
      document.querySelector(`input[data-filter="${type}"][value="${value}"]`)?.click();
      
      // Remove tag button active state
      document.querySelector(`.tag-btn[data-tag="${value}"]`)?.classList.remove('active');
      
      currentPage = 1;
      performSearch();
    });
  });
}

function getTimeLabel(value) {
  const labels = { short: '< 5 min', medium: '5-10 min', long: '10+ min' };
  return labels[value] || value;
}

function getDateLabel(value) {
  const labels = { week: 'This week', month: 'This month', year: 'This year' };
  return labels[value] || value;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function clearAllFilters() {
  activeFilters = { categories: [], tags: [], time: [], date: [] };
  searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
  currentPage = 1;
  performSearch();
}

// ==================== AI CHAT SEARCH ====================

function setupAIChat() {
  const chatInput = document.getElementById('chatInput');
  const sendMessage = document.getElementById('sendMessage');
  const chatMessages = document.getElementById('chatMessages');
  
  // Quick prompts
  document.querySelectorAll('.quick-prompt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prompt = e.target.dataset.prompt;
      chatInput.value = prompt;
      sendChatMessage();
    });
  });
  
  // Followup buttons
  document.querySelectorAll('.followup-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const refine = e.target.dataset.refine;
      handleFollowup(refine);
    });
  });
  
  // Send message
  sendMessage.addEventListener('click', sendChatMessage);
  
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
  
  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });
}

function sendChatMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  
  if (!message) return;
  
  // Add user message
  addUserMessage(message);
  chatHistory.push({ role: 'user', content: message });
  
  // Clear input
  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Process and respond
  setTimeout(() => {
    removeTypingIndicator();
    const response = processAIQuery(message);
    addGavinMessage(response);
    chatHistory.push({ role: 'gavin', content: response.text });
  }, 800 + Math.random() * 600);
}

function addUserMessage(text) {
  const container = document.getElementById('chatMessages');
  const html = `
    <div class="message user-message">
      <div class="message-content">
        <p>${escapeHtml(text)}</p>
      </div>
      <div class="message-avatar user">You</div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  const html = `
    <div class="message gavin-message typing-indicator" id="typingIndicator">
      <div class="message-avatar" style="padding: 0; overflow: hidden;"><img src="/assets/images/gavin-avatar.png" alt="G" style="width: 36px; height: 36px; border-radius: 50%;"></div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  document.getElementById('typingIndicator')?.remove();
}

function addGavinMessage(response) {
  const container = document.getElementById('chatMessages');
  const messageId = 'msg-' + Date.now();
  
  let html = `
    <div class="message gavin-message" id="${messageId}">
      <div class="message-avatar gavin-avatar-speaking" style="padding: 0; overflow: hidden;"><img src="/assets/images/gavin-avatar.png" alt="G" style="width: 36px; height: 36px; border-radius: 50%;"></div>
      <div class="message-content">
        ${response.text}
  `;
  
  // Add related questions if provided
  if (response.relatedQuestions) {
    html += `<div class="related-questions">`;
    html += `<p>Want to explore further?</p>`;
    html += `<div class="quick-prompts">`;
    response.relatedQuestions.forEach(q => {
      html += `<button class="quick-prompt" data-prompt="${q}">${q}</button>`;
    });
    html += `</div></div>`;
  }
  
  html += `</div></div>`;
  
  container.insertAdjacentHTML('beforeend', html);
  container.scrollTop = container.scrollHeight;
  
  // Re-attach event listeners for new quick prompts
  container.querySelectorAll('.quick-prompt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.getElementById('chatInput').value = e.target.dataset.prompt;
      sendChatMessage();
    });
  });
  
  // Show results
  if (response.results) {
    showAIResults(response);
  }
}

// AI Logic - Keywords and intent matching
const KEYWORD_MAP = {
  'cold chain': ['cold chain', 'temperature', 'pharma', 'food safety', 'refrigerated'],
  'temperature': ['cold chain', 'temperature', 'pharma', 'monitoring'],
  'pharma': ['pharma', 'FDA', 'compliance', 'cold chain', 'validation'],
  'food': ['food safety', 'cold chain', 'compliance'],
  'security': ['security', 'privacy', 'compliance', 'data protection'],
  'integration': ['ERP', 'integration', 'API', 'SAP', 'technical'],
  'alerts': ['alerts', 'notifications', 'thresholds', 'configuration'],
  'roi': ['ROI', 'value proposition', 'cost savings', 'business case'],
  'implementation': ['implementation', 'deployment', 'onboarding', 'playbook'],
  'bee labels': ['bee labels', 'basics', 'getting started', 'hardware'],
  'reusable': ['reusable bees', 'hardware', 'comparison'],
  'multi-modal': ['multi-modal', 'ocean', 'air freight', 'international'],
  'predictive': ['predictive', 'analytics', 'machine learning', 'AI'],
  'troubleshooting': ['troubleshooting', 'proactive', 'prevention'],
  'metrics': ['QBR', 'metrics', 'KPIs', 'reporting'],
  'rfp': ['RFP', 'vendor evaluation', 'procurement'],
  'calculator': ['ROI', 'calculator', 'value quantification'],
  'getting started': ['bee labels', 'basics', 'getting started', 'implementation'],
  'first time': ['bee labels', 'basics', 'getting started', 'implementation'],
  'new': ['bee labels', 'basics', 'getting started'],
  'cost': ['ROI', 'cost savings', 'calculator', 'hidden ROI'],
  'money': ['ROI', 'cost savings', 'value proposition'],
  'budget': ['ROI', 'calculator', 'business case'],
  'dashboard': ['bee data', 'interpretation', 'analytics'],
  'data': ['bee data', 'sensors', 'interpretation', 'analytics'],
  'sensors': ['bee data', 'sensors', 'hardware', 'technical'],
  'compliance': ['FDA', 'compliance', 'pharma', 'security', 'regulatory'],
  'international': ['multi-modal', 'ocean freight', 'air freight'],
  'shipping': ['multi-modal', 'trucking', 'ocean', 'air'],
  'transport': ['multi-modal', 'tracking', 'logistics'],
  'executive': ['executive', 'strategy', 'C-suite', 'briefing'],
  'cfo': ['ROI', 'business case', 'hidden ROI', 'executive'],
  'ceo': ['executive', 'strategy', 'customer wins', 'ROI'],
  'case study': ['customer wins', 'case studies', 'success stories'],
  'example': ['customer wins', 'case studies', 'examples'],
  'proactive': ['proactive', 'troubleshooting', 'prevention', 'predictive'],
  'prevent': ['proactive', 'troubleshooting', 'prevention'],
  'fix': ['troubleshooting', 'proactive', 'issues'],
  'problem': ['troubleshooting', 'proactive', 'issues'],
  'issue': ['troubleshooting', 'proactive', 'alerts'],
  'guide': ['implementation', 'playbook', 'how-to'],
  'how to': ['implementation', 'playbook', 'best practices'],
  'setup': ['implementation', 'bee labels', 'getting started'],
  'configure': ['alerts', 'configuration', 'implementation'],
  'optimize': ['best practices', 'strategy', 'hidden ROI'],
  'improve': ['best practices', 'strategy', 'proactive'],
  'learn': ['bee labels', 'basics', 'reading bee data'],
  'understand': ['basics', 'bee labels', 'executive briefing'],
  'tutorial': ['bee labels', 'implementation', 'reading bee data']
};

const USE_CASE_TEMPLATES = {
  'first_implementation': {
    keywords: ['first time', 'getting started', 'new', 'implementation', 'setup', 'configure'],
    explanation: "Based on your need to get started with IoT tracking, I've prioritized beginner-friendly guides, implementation playbooks, and foundational content."
  },
  'roi_justification': {
    keywords: ['roi', 'cost', 'money', 'budget', 'cfo', 'business case', 'value'],
    explanation: "I understand you need to build a strong business case. These articles focus on quantifying value, calculating ROI, and presenting to finance stakeholders."
  },
  'cold_chain_issues': {
    keywords: ['cold', 'temperature', 'pharma', 'food', 'refrigerated'],
    explanation: "For cold chain monitoring challenges, I've selected our most comprehensive guides on temperature monitoring, FDA compliance, and best practices."
  },
  'alert_optimization': {
    keywords: ['alerts', 'notifications', 'noise', 'thresholds', 'configure'],
    explanation: "To help you optimize your alerting strategy, I've found articles covering alert configuration, reducing noise, and setting effective thresholds."
  },
  'integration_technical': {
    keywords: ['integration', 'erp', 'api', 'sap', 'oracle', 'technical'],
    explanation: "For system integration needs, here are our technical guides covering ERP connectivity, APIs, and implementation patterns."
  },
  'executive_strategy': {
    keywords: ['executive', 'strategy', 'ceo', 'leadership', 'overview'],
    explanation: "These strategic articles are perfect for executive audiences - focusing on high-level trends, ROI frameworks, and competitive advantages."
  },
  'proactive_operations': {
    keywords: ['proactive', 'prevent', 'troubleshooting', 'fix', 'issues'],
    explanation: "For building proactive operations, I've selected content on prevention strategies, troubleshooting frameworks, and predictive approaches."
  }
};

function processAIQuery(message) {
  const lowerMsg = message.toLowerCase();
  
  // Determine use case
  let useCase = null;
  let matchedKeywords = [];
  
  // Check use case templates
  for (const [key, template] of Object.entries(USE_CASE_TEMPLATES)) {
    if (template.keywords.some(kw => lowerMsg.includes(kw))) {
      useCase = key;
      matchedKeywords = template.keywords.filter(kw => lowerMsg.includes(kw));
      break;
    }
  }
  
  // Collect all relevant keywords
  const relevantKeywords = [];
  for (const [kw, relatedTags] of Object.entries(KEYWORD_MAP)) {
    if (lowerMsg.includes(kw)) {
      relevantKeywords.push(...relatedTags);
    }
  }
  
  // Score and filter posts
  let scoredPosts = BLOG_DATA.map(post => {
    let score = 0;
    const searchText = `${post.title} ${post.description} ${post.tags.join(' ')} ${post.category} ${post.useCases.join(' ')}`.toLowerCase();
    
    // Score by keywords
    relevantKeywords.forEach(kw => {
      if (searchText.includes(kw.toLowerCase())) score += 2;
    });
    
    // Score by direct word matches
    const words = lowerMsg.split(/\s+/);
    words.forEach(word => {
      if (word.length > 3 && searchText.includes(word)) score += 1;
    });
    
    // Boost beginner content for first-time queries
    if (useCase === 'first_implementation' && post.difficulty === 'beginner') score += 5;
    
    // Boost ROI content for cost queries
    if (useCase === 'roi_justification' && (post.tags.includes('ROI') || post.contentType === 'calculator')) score += 5;
    
    // Boost technical for integration queries
    if (useCase === 'integration_technical' && post.category === 'Technical') score += 5;
    
    return { post, score };
  });
  
  // Sort by score and take top results
  scoredPosts.sort((a, b) => b.score - a.score);
  const topResults = scoredPosts.filter(s => s.score > 0).slice(0, 5).map(s => s.post);
  
  // Fallback: if no strong matches, show popular content
  if (topResults.length === 0) {
    const fallback = [...BLOG_DATA].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    return {
      text: `<p>I didn't find exact matches for your specific query. Here are our most popular articles that might help:</p>`,
      results: fallback,
      explanation: "Showing popular content as fallback",
      relatedQuestions: [
        "Tell me about cold chain monitoring",
        "How do I calculate ROI?",
        "What's the implementation process?",
        "Show me beginner guides"
      ]
    };
  }
  
  // Generate response text
  let responseText = '<p>';
  if (useCase && USE_CASE_TEMPLATES[useCase]) {
    responseText += `I understand you're looking for help with ${matchedKeywords.slice(0, 2).join(' and ')}. `;
  }
  responseText += `Here are ${topResults.length} articles that should help:</p>`;
  
  // Get explanation
  let explanation = "";
  if (useCase && USE_CASE_TEMPLATES[useCase]) {
    explanation = USE_CASE_TEMPLATES[useCase].explanation;
  } else {
    explanation = `I found these articles based on keywords: ${relevantKeywords.slice(0, 5).join(', ')}`;
  }
  
  return {
    text: responseText,
    results: topResults,
    explanation: explanation,
    relatedQuestions: generateRelatedQuestions(useCase, topResults)
  };
}

function generateRelatedQuestions(useCase, results) {
  const questions = {
    'first_implementation': [
      "What hardware should I choose?",
      "How long does implementation take?",
      "What are the common pitfalls?"
    ],
    'roi_justification': [
      "What are the hidden cost savings?",
      "How do I present to my CFO?",
      "Show me customer success stories"
    ],
    'cold_chain_issues': [
      "What about FDA compliance?",
      "How do temperature alerts work?",
      "Show me multi-modal options"
    ],
    'alert_optimization': [
      "How do I reduce alert fatigue?",
      "What thresholds should I set?",
      "Can I customize notifications?"
    ],
    'integration_technical': [
      "Do you have API documentation?",
      "What about ERP integration?",
      "How does the data flow work?"
    ],
    'executive_strategy': [
      "What are competitors doing?",
      "Show me market trends",
      "What about ROI frameworks?"
    ],
    'proactive_operations': [
      "How does predictive analytics work?",
      "Show me troubleshooting guides",
      "What metrics should I track?"
    ]
  };
  
  return questions[useCase] || [
    "Tell me more about this topic",
    "Show me related articles",
    "What do I need to get started?"
  ];
}

function showAIResults(response) {
  const emptyPanel = document.getElementById('aiResultsEmpty');
  const contentPanel = document.getElementById('aiResultsContent');
  const resultsList = document.getElementById('aiResultsList');
  
  emptyPanel.style.display = 'none';
  contentPanel.style.display = 'block';
  
  // Update explanation
  document.getElementById('aiResultsExplanation').textContent = response.explanation;
  
  // Render results
  resultsList.innerHTML = response.results.map((post, index) => `
    <div class="ai-result-card" style="animation-delay: ${index * 100}ms">
      <div class="result-number">${index + 1}</div>
      <a href="/posts/${post.slug}/" class="result-image-link">
        <div class="result-image">
          <img src="${post.image || '/assets/images/hero-bg.png'}" alt="${post.title}" loading="lazy">
        </div>
      </a>
      <div class="result-content">
        <div class="result-meta">
          <span class="category-badge">${post.category}</span>
          <span class="difficulty-badge difficulty-${post.difficulty}">
            ${post.difficulty.charAt(0).toUpperCase() + post.difficulty.slice(1)}
          </span>
          <span class="reading-time">${post.readingTime} min read</span>
        </div>
        <h4><a href="/posts/${post.slug}/">${post.title}</a></h4>
        <p>${post.description}</p>
        <div class="result-tags">
          ${post.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="result-why">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Matched: ${post.tags.slice(0, 2).join(', ')} • ${post.useCases[0] || 'General guidance'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function handleFollowup(refineType) {
  const messages = {
    simpler: "Can you show me simpler, beginner-friendly articles?",
    technical: "Show me more technical, detailed content.",
    strategic: "I need more strategic, high-level content.",
    recent: "Show me your most recent articles on this topic."
  };
  
  document.getElementById('chatInput').value = messages[refineType];
  sendChatMessage();
}

// ==================== SPEECH ANIMATION ====================

function startSpeakingAnimation(duration = 2000) {
  const headerAvatar = document.querySelector('.chat-header .gavin-avatar');
  const messageAvatars = document.querySelectorAll('.gavin-message:last-child .message-avatar img');
  
  // Add speaking class to trigger glow animation
  if (headerAvatar) {
    headerAvatar.classList.add('speaking');
    
    // Vary speed based on message length (simulated syllable rhythm)
    const syllableCount = Math.floor(duration / 150); // Approximate syllables
    if (syllableCount > 15) {
      headerAvatar.classList.add('speaking-fast');
    } else if (syllableCount < 8) {
      headerAvatar.classList.add('speaking-slow');
    }
  }
  
  messageAvatars.forEach(img => {
    img.parentElement.classList.add('speaking');
  });
  
  // Stop after duration
  setTimeout(() => {
    stopSpeakingAnimation();
  }, duration);
}

function stopSpeakingAnimation() {
  const avatars = document.querySelectorAll('.gavin-avatar, .gavin-avatar-speaking, .message-avatar');
  avatars.forEach(avatar => {
    avatar.classList.remove('speaking', 'speaking-fast', 'speaking-slow', 'idle');
  });
}

function setIdleAnimation() {
  const headerAvatar = document.querySelector('.chat-header .gavin-avatar');
  if (headerAvatar) {
    headerAvatar.classList.add('idle');
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
