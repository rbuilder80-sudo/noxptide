export { products, categories } from "../src/data/products";
export { guides } from "../src/data/guides";
export { seoForPath, INDEXABLE_PATHS, notFoundSeo } from "../src/data/seo";
import { prerender } from "react-dom/static";
import { MemoryRouter } from "react-router";
import App from "../src/App";

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );
  return await new Response(prelude).text();
}
