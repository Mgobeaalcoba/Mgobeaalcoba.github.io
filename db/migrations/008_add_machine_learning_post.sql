-- Add machine-learning-basics-guide blog post (referenced in sitemap but missing from seed)
INSERT INTO blog_posts (id, slug, file, title_es, title_en, excerpt_es, excerpt_en, date, category, featured, read_time, author, sort_order) VALUES
  (22, 'machine-learning-basics-guide', '2026-02-25-machine-learning-basics-guide.md',
   'Guía Completa de Machine Learning para Principiantes', 'Complete Machine Learning Guide for Beginners',
   'Aprende los fundamentos del Machine Learning: tipos de algoritmos, herramientas esenciales y cómo aplicarlos en proyectos reales.', 'Learn Machine Learning fundamentals: types of algorithms, essential tools and how to apply them in real projects.',
   '2026-02-25', 'automation',
   FALSE, '8 min', 'Mariano Gobea Alcoba', 22);

INSERT INTO blog_post_tags (post_id, tag) VALUES
  (22, 'machine-learning'),
  (22, 'python'),
  (22, 'scikit-learn'),
  (22, 'inteligencia-artificial');

SELECT setval('blog_posts_id_seq', 22);
