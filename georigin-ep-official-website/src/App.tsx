import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Games from '@/pages/Games'
import Devlog from '@/pages/Devlog'
import Post from '@/pages/Post'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/devlog" element={<Devlog />} />
        <Route path="/devlog/:slug" element={<Post />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
