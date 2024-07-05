import BlogList from '@/app/(test)/test/page';

const Blog = async () => {
  return (
    <div className="space-y-6 mx-6 my-28 ">
      <header className="space-y-2">
        <h2>Get updates</h2>
        <p>
          Read up on our project updates, documentation and announcements to
          stay updated with SummitShare.
        </p>
      </header>

      <BlogList />
    </div>
  );
};

export default Blog;
