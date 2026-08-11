import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Quality from "./pages/Quality";
import Faq from "./pages/Faq";
import About from "./pages/About";
import Shipping from "./pages/Shipping";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DataRetention from "./pages/DataRetention";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import { CmsProvider } from "./hooks/useCms";
import { ProductOverridesProvider } from "./hooks/useProductOverrides";
import { TRPCProvider } from "./providers/trpc";

// Heavy storefront pages code-split per route; react-dom/static prerender
// resolves them fully during SSG, hydration re-suspends until chunk loads.
const Shop = lazy(() => import("./pages/Shop"));
const Category = lazy(() => import("./pages/Category"));
const Product = lazy(() => import("./pages/Product"));
const Guides = lazy(() => import("./pages/Guides"));
const GuideArticle = lazy(() => import("./pages/GuideArticle"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCms = lazy(() => import("./pages/admin/AdminCms"));

const adminFallback = (
  <div className="p-10 text-center text-muted-foreground">Loading…</div>
);

export default function App() {
  return (
    <TRPCProvider>
      <CartProvider>
        <CmsProvider>
          <ProductOverridesProvider>
            <ScrollToTop />
            <Suspense fallback={null}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/product/:slug" element={<Product />} />
                  <Route path="/quality" element={<Quality />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/data-retention" element={<DataRetention />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/guides" element={<Guides />} />
                  <Route path="/guides/:slug" element={<GuideArticle />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={adminFallback}>
                      <AdminLayout />
                    </Suspense>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="cms" element={<AdminCms />} />
                </Route>
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={adminFallback}>
                      <Login />
                    </Suspense>
                  }
                />
              </Routes>
            </Suspense>
          </ProductOverridesProvider>
        </CmsProvider>
      </CartProvider>
    </TRPCProvider>
  );
}
