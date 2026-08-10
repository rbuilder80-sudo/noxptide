export { products, categories } from "../src/data/products";
export { guides } from "../src/data/guides";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { TRPCProvider } from "../src/providers/trpc";
import App from "../src/App";

export function render(url: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </MemoryRouter>,
  );
}
