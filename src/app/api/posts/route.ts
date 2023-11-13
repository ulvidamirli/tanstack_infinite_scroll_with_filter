import posts from "./data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const tag = Number(searchParams.get("tag") || 0);

  const filteredPosts =
    tag !== 0 ? posts.filter((post) => post.tag === tag) : posts;

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
