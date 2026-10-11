import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";

const Games = lazy(() => import("@/pages/Games"));
const Devlog = lazy(() => import("@/pages/Devlog"));
const Post = lazy(() => import("@/pages/Post"));

export default function App() {
  return (
    <Layout>
      <Suspense
        fallback={
          <p role="status" className="px-6 py-24 text-center">
            Loading…
          </p>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/devlog" element={<Devlog />} />
          <Route path="/devlog/:slug" element={<Post />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
