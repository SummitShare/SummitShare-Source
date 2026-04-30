import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/blog';

const Blog = async () => {
   const posts = await getAllPosts();

   return (
      <div className="my-40">
         <BlogList posts={posts} showNewsBanner />
      </div>
   );
};

export default Blog;
