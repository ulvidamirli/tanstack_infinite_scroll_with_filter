import MainSection from "@/app/posts/MainSection";
import { get } from "@/lib/httpClient";

export default async function ({ searchParams }: { searchParams: any }) {
  const urlParams = {
    page: searchParams.page || 1,
    tag: searchParams.tag || "",
    location: searchParams.location || "",
  };
  const qs = new URLSearchParams(urlParams).toString();
  const posts = await get(`/api/posts?${qs}`);

  // This is how useInfiniteQuery expects the data
  const postsData = {
    pages: [posts],
    pageParams: [urlParams.page],
  };

  const ssrData = {
    postsData,
    urlParams,
  };

  return (
    <div>
      <MainSection ssrData={ssrData} />
    </div>
  );
}
