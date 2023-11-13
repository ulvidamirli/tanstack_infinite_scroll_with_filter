"use client";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/lib/httpClient";
import { removeEmptyParams } from "@/lib/utils";

const tags = [
  { id: 1, name: "tag1" },
  { id: 2, name: "tag2" },
  { id: 3, name: "tag3" },
  { id: 4, name: "tag4" },
  { id: 5, name: "tag5" },
];

const locations = [
  { id: 1, name: "location1" },
  { id: 2, name: "location2" },
  { id: 3, name: "location3" },
  { id: 4, name: "location4" },
  { id: 5, name: "location5" },
];

export default function ({ ssrData }: { ssrData: any }) {
  const [urlParams, setUrlParams] = useState(ssrData.urlParams);

  const handleTagChange = (tagId: number) => {
    setUrlParams((prevState: any) => ({ ...prevState, tag: tagId }));
  };

  const handleLocationChange = (locationId: number) => {
    setUrlParams((prevState: any) => ({ ...prevState, location: locationId }));
  };

  const getItems = ({ queryKey, pageParam }: any) => {
    const qs = new URLSearchParams(queryKey[2]).toString();
    const cleanQs = removeEmptyParams(qs);
    window.history.pushState({}, "", `/posts?page=${pageParam}&${cleanQs}`);
    return get(`/api/posts?page=${pageParam}&${cleanQs}`);
  };

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      "items",
      "list",
      { tag: urlParams.tag, location: urlParams.location },
    ],
    queryFn: getItems,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextPage ? lastPage.meta.nextPage : undefined;
    },
    initialPageParam: ssrData.postsData.pageParams,
    initialData: ssrData.postsData,
    // staleTime: Infinity,
    // gcTime: 0, // disable garbage collection
  });

  const items = data?.pages?.flatMap((page) => page.results) ?? [];

  return (
    <div className="m-4">
      <h1 className="text-3xl font-bold">Posts</h1>
      {tags.length > 0 && (
        <div className="my-4">
          <h2 className="text-2xl font-bold mb-2">Filters</h2>
          <div className="flex gap-3">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagChange(tag.id)}
                type="button"
                name="tag"
                value={tag.id}
                className={`px-4 py-1 rounded-lg duration-200 cursor-pointer
                ${
                  urlParams.tag == tag.id
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-600 hover:bg-gray-500"
                }
            `}
              >
                {tag.name}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-3">
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationChange(location.id)}
                type="button"
                name="location"
                value={location.id}
                className={`px-4 py-1 rounded-lg duration-200 cursor-pointer
                ${
                  urlParams.location == location.id
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-gray-600 hover:bg-gray-500"
                }
                `}
              >
                {location.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <hr className="my-4" />
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <a href={`/posts/${item.id}`} className="flex items-center space-x-2 p-3 my-1 bg-gray-900 hover:bg-gray-800 duration-200 rounded-lg">
                <span>{item.title}</span>
                <span className="px-3 py-0.5 rounded-full bg-gray-600">Location {item.location}</span>
                <span className="px-3 py-0.5 rounded-full bg-gray-600">Tag {item.tag}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h1 className="text-3xl font-bold">No post found</h1>
        </div>
      )}
      <hr className="my-4" />
      {hasNextPage && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => fetchNextPage()}
        >
          Load more
        </button>
      )}
    </div>
  );
}
