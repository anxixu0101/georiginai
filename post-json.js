/*
 * @Author: an xixu
 * @Date: 2026-06-12 13:46:49
 * @LastEditTime: 2026-06-12 13:46:54
 * @FilePath: \公司官网\post-json.js
 * @Description: 
 * @Copyright: Copyright (c) 2026 GEORIGIN Technology Co., Ltd.
 */
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'posts.json');

// 简单提取 Markdown 标题和摘要
function parseMarkdown(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  let title = '';
  let excerpt = '';

  for (let line of lines) {
    // 提取第一个 # 标题
    if (!title && line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
      continue;
    }
    // 提取第一个非空段落作为摘要
    if (!excerpt && !line.startsWith('#') && line.length > 20) {
      excerpt = line.trim();
      break;
    }
  }

  return { title, excerpt };
}

// 主逻辑
function generatePostsJson() {
  if (!fs.existsSync(postsDir)) {
    console.error('❌ posts 文件夹不存在！');
    return;
  }

  const files = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => b.localeCompare(a)); // 按文件名降序（假设文件名是日期格式）

  const posts = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { title, excerpt } = parseMarkdown(content);

    // 从文件名提取日期（支持 2026-01-07.md 格式）
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : '2026-01-01';

    posts.push({
      date: date,
      slug: file,
      title: title || file.replace('.md', ''),
      excerpt: excerpt || '点击查看详情...'
    });
  }

  // 按日期降序排序
  posts.sort((a, b) => b.date.localeCompare(a.date));

  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`✅ 成功生成 posts.json，共 ${posts.length} 篇文章`);
  console.log(`📄 最新两篇：${posts[0]?.title}、${posts[1]?.title}`);
}

generatePostsJson();