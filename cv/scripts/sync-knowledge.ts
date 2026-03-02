import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const hfToken = process.env.HUGGINGFACE_TOKEN!;

if (!supabaseUrl || !supabaseKey || !hfToken) {
  console.error('Missing environment variables. Check .env.local (HUGGING_FACE_TOKEN is required for free embeddings)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const POSTS_DIR = path.resolve(process.cwd(), 'content/posts');

async function getEmbedding(text: string) {
  const model = 'intfloat/multilingual-e5-small';
  const url = `https://router.huggingface.co/hf-inference/models/${model}/pipeline/feature-extraction`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${hfToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`HuggingFace Error: ${JSON.stringify(data.error)}`);
  }
  // The feature-extraction pipeline returns a flat array of numbers for a single input string
  return data;
}

async function syncPosts() {
  console.log('Starting knowledge sync...');
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content: body } = matter(content);

    // Simple chunking strategy: split by paragraphs or max length
    // For now, let's take the whole body if it's small, or split it.
    // Professional approach: split by ~1000 chars with overlap.
    const chunks = body.match(/[\s\S]{1,1500}(?=\n\n|$)/g) || [body];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].trim();
      if (!chunk) continue;

      console.log(`  Generating embedding for chunk ${i+1}/${chunks.length}...`);
      try {
        const embedding = await getEmbedding(chunk);
        const slug = file.replace(/\.md$/, '');

        const { error } = await supabase
          .from('knowledge')
          .upsert({
            content: chunk,
            slug: slug,
            type: 'blog',
            metadata: {
              title: frontmatter.title || slug,
              chunk_index: i,
              file: file
            },
            embedding: embedding
          }, { onConflict: 'slug, content' }); // Requires unique index on slug+content or similar

        if (error) console.error(`  Error upserting chunk: ${error.message}`);
      } catch (err) {
        console.error(`  Failed chunk ${i}:`, err);
      }
    }
  }
  console.log('Sync complete!');
}

syncPosts().catch(console.error);
