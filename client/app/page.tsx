import Link from "next/link";
import { Post } from "./models";
import { getPosts } from "./utils/api";

async function getData() {
  return await getPosts();
}

export default async function BlogPage() {
  const data = (await getData()) as Post[];

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      </div>

      <ul>
        {data.map((post) => (
          <li key={post.id} className="py-4">
            <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
              <div>
                <p className="text-base font-medium leading-6 text-teal-500">
                  {new Date(post.createdAt.split('.')[0]).toLocaleDateString()}
                </p>
              </div>

              <Link href={`/post/${post.id}`}
                prefetch
                className="space-y-3 xl:col-span-3"
              >
                <div>
                  <h3 className="text-2xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100">
                    {post.title}
                  </h3>
                </div>


                <p className="prose max-w-none text-gray-500 dark:text-gray-400 line-clamp-2">
                  {post.summary}
                </p>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}