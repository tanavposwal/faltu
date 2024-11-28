import Link from "next/link";
import Image from "next/image";
import { db } from "~/server/db";
import { HeartIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { images } from "~/server/db/schema";
import { desc, ilike } from "drizzle-orm";

export default async function HomePage(props: { searchParams: any }) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.s || "";
  let imagesArr;
  if (keyword === "") {
    imagesArr = await db
      .select()
      .from(images)
      .orderBy(desc(images.createdAt));
  } else {
    imagesArr = await db
      .select()
      .from(images)
      .where(keyword ? ilike(images.name, `%${keyword}%`) : undefined);
  }

  return (
    <main>
      <div className="flex flex-wrap justify-center gap-4 p-3 py-4 md:px-16">
        <div className="mb-4 flex w-full justify-center px-8 md:px-0">
          <form
            className="flex w-full max-w-lg items-center space-x-2"
            method="get"
          >
            <Input
              type="text"
              name="s"
              placeholder="keyword..."
              defaultValue={keyword}
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        {imagesArr.map((image) => (
          <Link
            href={"/image/" + image.id}
            className="flex w-fit select-none flex-col items-center justify-center"
            draggable="false"
            key={image.id}
          >
            <Image
              src={image.url}
              width={260}
              height={260}
              quality={40}
              alt="a user photo"
              className="block h-fit max-h-52 w-fit max-w-52 select-none rounded brightness-100 transition-transform hover:brightness-90"
              draggable="false"
            />
            <div className="mt-1 flex w-52 font-semibold">
              <p className="text-md mr-2 w-full truncate text-primary">
                {image.name}
              </p>
              <div className="flex items-center justify-center gap-1 text-pink-600">
                <HeartIcon className="h-5 w-5" />
                {image.clap}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
