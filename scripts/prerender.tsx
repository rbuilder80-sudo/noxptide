export { products, categories } from "../src/data/products";
export { guides } from "../src/data/guides";
export { seoForPath, INDEXABLE_PATHS, notFoundSeo } from "../src/data/seo";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import App from "../src/App";

export function render(url: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );
}
