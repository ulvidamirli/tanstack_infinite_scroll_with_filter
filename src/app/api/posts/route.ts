import posts from "./data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const tag = Number(searchParams.get("tag") || 0);
  const location = Number(searchParams.get("location") || 0);

  let filteredPosts = posts;

  if (tag !== 0 && location !== 0) {
    filteredPosts = posts.filter(
      (post) => post.location === location || post.tag === tag
    );
  }

  if (tag === 0 && location !== 0) {
    filteredPosts = posts.filter((post) => post.location === location);
  }

  if (tag !== 0 && location === 0) {
    filteredPosts = posts.filter((post) => post.tag === tag);
  }

  const pageSize = 3;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const postsPerPage = filteredPosts.slice(start, end);
  const total = filteredPosts.length;
  const totalPages = Math.ceil(total / pageSize);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  const pagination = {
    nextPage,
    prevPage,
    totalPages,
    total,
  };

  return Response.json({ results: postsPerPage, meta: pagination });
}
