import { fetchPosts } from "@/lib/actions/thread.actions";

export default async function Home() {
  const { posts } = await fetchPosts(1, 30);
  console.log(posts);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {posts.length === 0 ? (
          <p className="no-result">No threads found! </p>
        ) : (
          <>
            {posts.map((post) => (
              <p className=" text-light-1">{post.text}</p>
              //start here
            ))}
          </>
        )}
      </section>
    </>
  );
}
