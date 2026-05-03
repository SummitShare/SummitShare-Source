import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { getBlogDateTimestamp } from './blogDates';

export interface PostMeta {
   slug: string;
   title: string;
   description: string;
   tags: string[];
   published: string;
   updated: string;
}

export interface Post extends PostMeta {
   content: string;
}

export interface PostStats {
   wordCount: number;
   readingTimeMinutes: number;
}

const WORDS_PER_MINUTE = 220;

export function getPostStats(content: string): PostStats {
   const wordCount = content
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`[^`]*`/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_~`>-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length;

   return {
      wordCount,
      readingTimeMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
   };
}

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');
const POST_FILE_EXTENSION = '.md';
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type BlogFrontmatter = {
   title?: string;
   description?: string;
   tags?: string[];
   published?: string;
   updated?: string;
};

function toPostMeta(slug: string, data: BlogFrontmatter): PostMeta {
   return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      published: data.published ?? '',
      updated: data.updated ?? data.published ?? '',
   };
}

function sortByPublishedDesc(a: PostMeta, b: PostMeta) {
   const aPublished =
      getBlogDateTimestamp(a.published) ?? Number.NEGATIVE_INFINITY;
   const bPublished =
      getBlogDateTimestamp(b.published) ?? Number.NEGATIVE_INFINITY;

   if (aPublished === bPublished) {
      return a.slug.localeCompare(b.slug);
   }

   return bPublished - aPublished;
}

async function getPostFileNames() {
   const files = await fs.readdir(CONTENT_DIR);

   return files.filter((file) => file.endsWith(POST_FILE_EXTENSION));
}

async function readPostFile(fileName: string): Promise<Post> {
   const slug = path.basename(fileName, POST_FILE_EXTENSION);
   const filePath = path.join(CONTENT_DIR, fileName);
   const file = await fs.readFile(filePath, 'utf8');
   const { data, content } = matter(file);

   return {
      ...toPostMeta(slug, data as BlogFrontmatter),
      content,
   };
}

export async function getAllPosts(): Promise<PostMeta[]> {
   const files = await getPostFileNames();
   const posts = await Promise.all(files.map(readPostFile));

   return posts.map(({ content, ...meta }) => meta).sort(sortByPublishedDesc);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
   if (!SLUG_PATTERN.test(slug)) {
      return null;
   }

   try {
      return await readPostFile(`${slug}${POST_FILE_EXTENSION}`);
   } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
         return null;
      }

      throw error;
   }
}

export async function getAllSlugs(): Promise<string[]> {
   const files = await getPostFileNames();

   return files.map((file) => path.basename(file, POST_FILE_EXTENSION)).sort();
}

export async function getAdjacentPosts(slug: string): Promise<{
   previous: PostMeta | null;
   next: PostMeta | null;
}> {
   const posts = await getAllPosts();
   const index = posts.findIndex((post) => post.slug === slug);

   if (index === -1) {
      return { previous: null, next: null };
   }

   return {
      previous: index < posts.length - 1 ? posts[index + 1] : null,
      next: index > 0 ? posts[index - 1] : null,
   };
}

export async function getRelatedPosts(
   slug: string,
   tags: string[],
   limit = 3
): Promise<PostMeta[]> {
   const posts = await getAllPosts();
   const tagSet = new Set(tags);

   const scored = posts
      .filter((post) => post.slug !== slug)
      .map((post) => ({
         post,
         overlap: post.tags.filter((tag) => tagSet.has(tag)).length,
      }))
      .filter(({ overlap }) => overlap > 0)
      .sort((a, b) => b.overlap - a.overlap);

   return scored.slice(0, limit).map(({ post }) => post);
}
