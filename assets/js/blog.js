// blog.js - Blog functionality for Data Engineering en las Trincheras
import logger from './logger.js';
import { translations } from './translations.js';

/**
 * BlogManager - Gestiona posts y videos del blog
 */
class BlogManager {
  constructor() {
    this.posts = [];
    this.videos = [];
    this.currentCategory = 'all';
    this.currentLang = document.documentElement.lang || 'es';
  }

  /**
   * Inicializar el blog manager
   */
  async initialize() {
    try {
      logger.debug('BlogManager', 'Initializing blog...');
      
      await this.loadBlogIndex();
      await this.loadVideos();
      this.renderPosts();
      this.renderVideos();
      this.setupFilters();
      this.setupLanguage();
      
      logger.success('BlogManager', 'Blog initialized successfully');
    } catch (error) {
      logger.error('Error initializing blog:', error);
      this.showError('Error al cargar el blog. Por favor, recarga la página.');
    }
  }

  /**
   * Cargar index de posts desde JSON
   */
  async loadBlogIndex() {
    try {
      const response = await fetch('blog/blog-index.json');
      if (!response.ok) throw new Error('Failed to load blog index');
      
      const data = await response.json();
      this.posts = data.posts || [];
      this.categories = data.categories || [];
      
      logger.debug('BlogManager', 'Blog index loaded', { 
        postCount: this.posts.length,
        categories: this.categories 
      });
    } catch (error) {
      logger.error('Error loading blog index:', error);
      throw error;
    }
  }

  /**
   * Cargar videos desde JSON
   */
  async loadVideos() {
    try {
      const response = await fetch('blog/videos.json');
      if (!response.ok) throw new Error('Failed to load videos');
      
      const data = await response.json();
      this.videos = data.videos || [];
      this.playlists = data.playlists || [];
      
      logger.debug('BlogManager', 'Videos loaded', { 
        videoCount: this.videos.length,
        playlists: this.playlists.length 
      });
    } catch (error) {
      logger.error('Error loading videos:', error);
      // No crítico, continuar sin videos
      this.videos = [];
    }
  }

  /**
   * Cargar y parsear un post individual
   */
  async loadPost(slug) {
    try {
      const post = this.posts.find(p => p.slug === slug);
      if (!post) throw new Error(`Post not found: ${slug}`);
      
      const response = await fetch(`blog/posts/${post.file}`);
      if (!response.ok) throw new Error('Failed to load post content');
      
      const markdown = await response.text();
      
      // Parse frontmatter y content
      const parsed = this.parseMarkdown(markdown);
      
      logger.debug('BlogManager', 'Post loaded', { slug });
      
      return {
        metadata: { ...post, ...parsed.frontmatter },
        content: parsed.content,
        html: this.markdownToHtml(parsed.content)
      };
    } catch (error) {
      logger.error('Error loading post:', error);
      throw error;
    }
  }

  /**
   * Parse Markdown con frontmatter YAML
   */
  parseMarkdown(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
      return {
        frontmatter: {},
        content: markdown
      };
    }
    
    const frontmatterText = match[1];
    const content = match[2];
    
    // Parse simple YAML (key: value)
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // Handle arrays [item1, item2]
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
        }
        
        // Handle booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        frontmatter[key] = value;
      }
    });
    
    return { frontmatter, content };
  }

  /**
   * Convertir Markdown a HTML (parser mejorado con tablas)
   */
  markdownToHtml(markdown) {
    let html = markdown;
    
    // Tables (debe procesarse ANTES que otros elementos)
    html = this.parseMarkdownTables(html);
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    
    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<[h|ul|ol|pre|table]/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('\n');
    
    return html;
  }

  /**
   * Parser de tablas Markdown
   */
  parseMarkdownTables(text) {
    // Buscar patrones de tabla: | header | header |
    const tableRegex = /(\|.+\|\n\|[-:\s|]+\|\n(?:\|.+\|\n?)+)/gm;
    
    return text.replace(tableRegex, (match) => {
      const lines = match.trim().split('\n');
      if (lines.length < 3) return match; // No es una tabla válida
      
      // Línea 1: Headers
      const headers = lines[0].split('|').filter(h => h.trim()).map(h => h.trim());
      
      // Línea 2: Separador (ignorar)
      
      // Líneas 3+: Filas de datos
      const rows = lines.slice(2).map(line => 
        line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
      );
      
      // Construir HTML
      let tableHtml = '<table class="markdown-table"><thead><tr>';
      headers.forEach(header => {
        tableHtml += `<th>${header}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';
      
      rows.forEach(row => {
        tableHtml += '<tr>';
        row.forEach(cell => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      });
      
      tableHtml += '</tbody></table>';
      
      return tableHtml;
    });
  }

  /**
   * Renderizar lista de posts
   */
  renderPosts() {
    const container = document.getElementById('blog-posts');
    if (!container) return;
    
    const filtered = this.filterPosts();
    
    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-inbox text-4xl text-secondary mb-4"></i>
          <p class="text-secondary" data-translate="blog_no_posts">
            No hay posts en esta categoría.
          </p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = filtered.map(post => this.createPostCard(post)).join('');
    
    logger.debug('BlogManager', 'Posts rendered', { count: filtered.length });
  }

  /**
   * Crear card de post
   */
  createPostCard(post) {
    const categoryClass = post.category.toLowerCase().replace(/\s+/g, '-');
    const categoryLabel = this.getCategoryLabel(post.category);
    
    // Soporte para title/excerpt bilingüe o string simple
    const title = typeof post.title === 'object' ? post.title[this.currentLang] : post.title;
    const excerpt = typeof post.excerpt === 'object' ? post.excerpt[this.currentLang] : post.excerpt;
    
    return `
      <article class="blog-card glass-effect" onclick="window.location.href='blog-post.html?slug=${post.slug}'" style="cursor: pointer;">
        <div class="blog-meta">
          <span class="category ${categoryClass}">${categoryLabel}</span>
          <span class="date">${this.formatDate(post.date)}</span>
        </div>
        <h3 class="blog-title">${title}</h3>
        ${excerpt ? `<p class="blog-excerpt">${excerpt}</p>` : ''}
        <div class="blog-footer">
          <span class="read-time">
            <i class="fas fa-clock mr-1"></i>${post.readTime || '5 min'}
          </span>
          <a href="blog-post.html?slug=${post.slug}" class="read-more" onclick="event.stopPropagation(); this.trackPostClick('${post.slug}', '${post.category}');">
            <span data-translate="blog_read_more">Leer más</span>
            <i class="fas fa-arrow-right ml-1"></i>
          </a>
        </div>
      </article>
    `;
  }

  /**
   * Track post click
   */
  trackPostClick(slug, category) {
    if (typeof gtag === 'function') {
      gtag('event', 'blog_post_click', {
        event_category: 'content',
        post_slug: slug,
        post_category: category
      });
    }
  }

  /**
   * Renderizar videos
   */
  renderVideos() {
    const container = document.getElementById('videos-grid');
    if (!container) return;
    
    const featured = this.videos.filter(v => v.featured);
    
    if (featured.length === 0) {
      container.innerHTML = `
        <p class="text-secondary text-center col-span-full">
          <span data-translate="blog_no_videos">Próximamente: Masterclass y tutoriales.</span>
        </p>
      `;
      return;
    }
    
    container.innerHTML = featured.map(video => this.createVideoCard(video)).join('');
    
    logger.debug('BlogManager', 'Videos rendered', { count: featured.length });
  }

  /**
   * Crear card de video
   */
  createVideoCard(video) {
    // Soporte para title/description bilingüe
    const title = typeof video.title === 'object' ? video.title[this.currentLang] : video.title;
    const description = typeof video.description === 'object' ? video.description[this.currentLang] : video.description;
    
    return `
      <div class="video-card glass-effect" data-video-id="${video.id}" data-youtube-id="${video.youtubeId}">
        <div class="video-embed" onclick="trackVideoClick('${video.id}', '${title}')">
          <iframe 
            src="https://www.youtube.com/embed/${video.youtubeId}"
            title="${title}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
        <div class="video-content">
          <h4 class="video-title">${title}</h4>
          <p class="video-description">${description}</p>
          <div class="video-meta">
            <span class="duration">
              <i class="fas fa-play-circle mr-1"></i>${video.duration}
            </span>
            <span class="date">${this.formatDate(video.date)}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Track video interaction
   */
  trackVideoClick(videoId, videoTitle) {
    if (typeof gtag === 'function') {
      gtag('event', 'video_play', {
        event_category: 'engagement',
        video_id: videoId,
        video_title: videoTitle
      });
      logger.debug('BlogManager', 'Video play tracked', { videoId });
    }
  }

  /**
   * Filtrar posts por categoría
   */
  filterPosts() {
    if (this.currentCategory === 'all') {
      return this.posts;
    }
    return this.posts.filter(post => post.category === this.currentCategory);
  }

  /**
   * Setup filtros de categoría
   */
  setupFilters() {
    const filterButtons = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        this.currentCategory = category;
        
        // Update UI
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Re-render posts
        this.renderPosts();
        
        logger.debug('BlogManager', 'Category filter applied', { category });
      });
    });
  }

  /**
   * Setup cambio de idioma
   */
  setupLanguage() {
    const langButtons = document.querySelectorAll('#lang-es, #lang-en');
    
    langButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const lang = btn.id === 'lang-es' ? 'es' : 'en';
        this.currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        
        // Update translations
        this.updateTranslations();
        
        // Re-render posts and videos with new language
        this.renderPosts();
        this.renderVideos();
        
        // Update active button
        langButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        logger.debug('BlogManager', 'Language changed and content re-rendered', { lang });
      });
    });
    
    // Set initial language from localStorage or default
    const savedLang = localStorage.getItem('language') || 'es';
    this.currentLang = savedLang;
    document.documentElement.lang = savedLang;
    
    // Update button states
    const activeBtn = savedLang === 'es' ? document.getElementById('lang-es') : document.getElementById('lang-en');
    if (activeBtn) activeBtn.classList.add('active');
  }

  /**
   * Actualizar traducciones en la página
   */
  updateTranslations() {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[key] && translations[key][this.currentLang]) {
        el.textContent = translations[key][this.currentLang];
      }
    });
  }

  /**
   * Helpers
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const lang = this.currentLang;
    
    return date.toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCategoryLabel(category) {
    const categoryKey = `blog_category_${category.replace(/-/g, '_')}`;
    if (translations[categoryKey] && translations[categoryKey][this.currentLang]) {
      return translations[categoryKey][this.currentLang];
    }
    return category;
  }

  showError(message) {
    const container = document.getElementById('blog-posts');
    if (container) {
      container.innerHTML = `
        <div class="error-message col-span-full text-center py-12">
          <i class="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
          <p>${message}</p>
        </div>
      `;
    }
  }
}

/**
 * BlogPostManager - Para página individual de post
 */
class BlogPostManager {
  constructor() {
    this.currentLang = document.documentElement.lang || 'es';
  }

  /**
   * Inicializar página de post individual
   */
  async initialize() {
    try {
      logger.debug('BlogPostManager', 'Initializing blog post...');
      
      // Get slug from URL
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');
      
      if (!slug) {
        throw new Error('No slug provided');
      }
      
      // Load blog manager to get post metadata
      const blogManager = new BlogManager();
      await blogManager.loadBlogIndex();
      
      // Load post content
      const postData = await blogManager.loadPost(slug);
      
      // Render post
      this.renderPost(postData);
      
      // Setup SEO
      this.setupSEO(postData.metadata);
      
      // Track post view
      this.trackPostView(postData.metadata);
      
      // Load related posts
      this.renderRelatedPosts(blogManager.posts, postData.metadata);
      
      logger.success('BlogPostManager', 'Blog post loaded successfully');
    } catch (error) {
      logger.error('Error loading blog post:', error);
      this.showError('Post no encontrado. <a href="blog.html">Volver al blog</a>');
    }
  }

  /**
   * Renderizar post completo
   */
  renderPost(postData) {
    const { metadata, html } = postData;
    
    // Soporte bilingüe para title
    const title = typeof metadata.title === 'object' ? metadata.title[this.currentLang] : metadata.title;
    
    // Update title
    document.title = `${title} | Mariano Gobea Blog`;
    
    // Render header
    const header = document.getElementById('post-header');
    if (header) {
      header.innerHTML = `
        <div class="post-category">${metadata.category}</div>
        <h1 class="post-title">${title}</h1>
        <div class="post-meta">
          <span class="author">
            <i class="fas fa-user mr-1"></i>${metadata.author || 'Mariano Gobea Alcoba'}
          </span>
          <span class="date">
            <i class="fas fa-calendar mr-1"></i>${this.formatDate(metadata.date)}
          </span>
          <span class="read-time">
            <i class="fas fa-clock mr-1"></i>${metadata.readTime || '5 min'}
          </span>
        </div>
      `;
    }
    
    // Render content
    const content = document.getElementById('post-content');
    if (content) {
      content.innerHTML = html;
    }
    
    // Generate TOC
    this.generateTableOfContents(content);
  }

  /**
   * Generar tabla de contenidos automática
   */
  generateTableOfContents(contentElement) {
    const toc = document.getElementById('post-toc');
    if (!toc || !contentElement) return;
    
    const headings = contentElement.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      toc.style.display = 'none';
      return;
    }
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
      // Add ID to heading
      const id = `heading-${index}`;
      heading.id = id;
      
      // Create TOC item
      const li = document.createElement('li');
      li.className = heading.tagName.toLowerCase();
      li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
      tocList.appendChild(li);
    });
    
    toc.innerHTML = '<h4>Contenido</h4>';
    toc.appendChild(tocList);
  }

  /**
   * Setup SEO meta tags dinámicamente
   */
  setupSEO(metadata) {
    // Update meta description
    if (metadata.excerpt) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = metadata.excerpt;
    }
    
    // Update meta keywords
    if (metadata.tags) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = Array.isArray(metadata.tags) ? 
        metadata.tags.join(', ') : metadata.tags;
    }
    
    // Update Open Graph
    this.updateMetaTag('property', 'og:title', metadata.title);
    this.updateMetaTag('property', 'og:description', metadata.excerpt || '');
    this.updateMetaTag('property', 'og:type', 'article');
    
    // Update Twitter Card
    this.updateMetaTag('name', 'twitter:title', metadata.title);
    this.updateMetaTag('name', 'twitter:description', metadata.excerpt || '');
  }

  updateMetaTag(attr, value, content) {
    let meta = document.querySelector(`meta[${attr}="${value}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, value);
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  /**
   * Renderizar posts relacionados
   */
  renderRelatedPosts(allPosts, currentPostMeta) {
    const container = document.getElementById('related-posts');
    if (!container) return;
    
    // Find posts with same category or tags
    const related = allPosts
      .filter(p => p.slug !== currentPostMeta.slug)
      .filter(p => p.category === currentPostMeta.category || 
                   (Array.isArray(p.tags) && Array.isArray(currentPostMeta.tags) &&
                    p.tags.some(tag => currentPostMeta.tags.includes(tag))))
      .slice(0, 3);
    
    if (related.length === 0) {
      container.style.display = 'none';
      return;
    }
    
    container.innerHTML = `
      <h3 data-translate="blog_related_posts">Posts Relacionados</h3>
      <div class="related-posts-grid">
        ${related.map(post => {
          // Soporte bilingüe
          const title = typeof post.title === 'object' ? post.title[this.currentLang] : post.title;
          const excerpt = typeof post.excerpt === 'object' ? post.excerpt[this.currentLang] : post.excerpt;
          
          return `
            <a href="blog-post.html?slug=${post.slug}" class="related-post-card glass-effect">
              <h4>${title}</h4>
              <p class="text-sm text-secondary">${excerpt || ''}</p>
              <span class="read-time text-xs">${post.readTime || '5 min'}</span>
            </a>
          `;
        }).join('')}
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const lang = this.currentLang;
    
    return date.toLocaleDateString(lang === 'es' ? 'es-AR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Track post view in Google Analytics
   */
  trackPostView(metadata) {
    if (typeof gtag === 'function') {
      gtag('event', 'blog_post_view', {
        event_category: 'content',
        post_slug: metadata.slug,
        post_title: metadata.title,
        post_category: metadata.category,
        read_time: metadata.readTime
      });
      logger.debug('BlogPostManager', 'Post view tracked', { slug: metadata.slug });
    }
  }

  showError(message) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `
        <div class="error-container text-center py-16">
          <i class="fas fa-exclamation-circle text-6xl text-red-400 mb-4"></i>
          <p class="text-xl">${message}</p>
        </div>
      `;
    }
  }
}

// Export managers
export { BlogManager, BlogPostManager };

// Global helper function for video tracking
window.trackVideoClick = function(videoId, videoTitle) {
  if (typeof gtag === 'function') {
    gtag('event', 'video_play', {
      event_category: 'engagement',
      video_id: videoId,
      video_title: videoTitle
    });
  }
};

// Auto-initialize based on page
if (document.getElementById('blog-posts')) {
  // Blog listing page
  const blogManager = new BlogManager();
  document.addEventListener('DOMContentLoaded', () => {
    blogManager.initialize();
  });
} else if (document.getElementById('post-content')) {
  // Individual post page
  const postManager = new BlogPostManager();
  document.addEventListener('DOMContentLoaded', () => {
    postManager.initialize();
  });
}
