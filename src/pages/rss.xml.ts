import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";

export async function GET(context: { site?: string | URL }) {
  const posts = (await getCollection("blog")).sort((a, b) => +b.data.pubDate - +a.data.pubDate);
  return rss({
    title: `${site.name} Blog`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.description,
      link: `/blog/${p.id}`,
    })),
    customData: `<language>en-IN</language>`,
  });
}
