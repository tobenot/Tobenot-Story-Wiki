import MarkdownIt from 'markdown-it'

// 初始化 markdown 解析器并启用 HTML 支持
const md = new MarkdownIt({
  html: true,  // 启用 HTML 标签支持
  breaks: true, // 将换行符转换为 <br>
  linkify: true // 自动识别链接
})

// 内容类型定义
export interface ContentEntry {
  id: string
  title: string
  type: string
  tags?: string[]
  related?: string[]
  content: string
  description?: string
}

// 提取 Front Matter 和正文内容
function parseFrontMatter(text: string): { frontMatter: Record<string, any>, content: string } {
  const frontMatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/
  const match = frontMatterRegex.exec(text)
  
  if (!match) {
    return { frontMatter: {}, content: text }
  }
  
  const frontMatterText = match[1]
  const content = match[2]
  
  // 简单解析 YAML 格式的 Front Matter
  const frontMatter: Record<string, any> = {}
  frontMatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // 处理引号
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      
      // 处理数组
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayItems = value.slice(1, -1).split(',').map(item => {
          const trimmed = item.trim()
          return trimmed.startsWith('"') && trimmed.endsWith('"') ? trimmed.slice(1, -1) : trimmed
        })
        frontMatter[key] = arrayItems
      } else {
        frontMatter[key] = value
      }
    }
  })
  
  return { frontMatter, content }
}

// 从 Markdown 内容中提取简短描述
function extractDescription(content: string, maxLength = 150): string {
  // 移除标题
  const withoutHeadings = content.replace(/^#.*$/gm, '').trim()
  // 移除 HTML 标签
  const withoutHtml = withoutHeadings.replace(/<[^>]*>/g, '')
  // 提取第一段文字
  const firstParagraph = withoutHtml.split('\n\n')[0]
  
  if (firstParagraph.length <= maxLength) {
    return firstParagraph
  }
  
  return firstParagraph.substring(0, maxLength) + '...'
}

// 用于模拟从文件系统加载内容的函数
// 实际应用中，这应该从 Vite 导入的 Markdown 文件中获取
export async function loadContentEntry(type: string, id: string): Promise<ContentEntry | null> {
  try {
    // 在实际应用中，使用 import.meta.glob 动态导入所有内容文件
    if (type === 'characters') {
      if (id === 'example-character') {
        // 这是模拟数据，实际应从文件加载
        const fileContent = `---
title: "托贝诺特"
type: "人物"
tags: ["主角", "创造者"]
related: ["魔法世界", "创造仪式"]
---

# 托贝诺特

托贝诺特是这个世界观的创造者，拥有操控现实的神秘力量。

## 基本信息

- **性别**：未知
- **年龄**：超越时间
- **职业**：世界创造者
- **特点**：富有想象力，喜欢创造新的世界和故事

## 能力

托贝诺特拥有创造和重塑现实的能力，能够通过思想构建完整的世界体系。

<div class="spoiler" data-source="《创世纪》第一章">
托贝诺特实际上是所有故事中角色的原型，每个角色都是其分裂人格的一部分。在某种程度上，所有角色都是托贝诺特自身的映射。
</div>

## 历史背景

托贝诺特的起源充满谜团，没有人知道他来自何处，又将去向何方。

<div class="spoiler" data-source="《终章》最后的秘密">
在世界的尽头，托贝诺特发现自己创造的所有世界实际上是一个更高维度存在的梦境，而他自己也只是这个梦境的一部分。
</div>

## 作品中的角色

托贝诺特虽然很少在作品中直接出场，但往往会以各种隐晦的方式影响故事的发展。`
        
        const { frontMatter, content } = parseFrontMatter(fileContent)
        const description = extractDescription(content)
        
        return {
          id,
          content,
          description,
          title: frontMatter.title || '',
          type: frontMatter.type || '',
          tags: frontMatter.tags || [],
          related: frontMatter.related || []
        }
      } 
      
      if (id === 'sample-character') {
        const fileContent = `---
title: "示例角色"
type: "人物"
tags: ["示例", "测试"]
related: ["相关条目1", "相关条目2"]
---

# 示例角色

这是一个示例角色的介绍。这个段落是普通文本，不包含剧透内容。

## 基本信息

- **性别**：未知
- **年龄**：不详
- **职业**：测试员

## 特殊能力

这个角色拥有一些特殊能力，下面包含一些剧透内容。

<div class="spoiler" data-source="《示例作品》第一章">
这是一段剧透内容，默认应该被模糊处理。这个角色实际上拥有穿越时空的能力，但在故事前期被封印了。
</div>

## 历史背景

这个角色有着神秘的背景，一般读者只知道他来自远方。

<div class="spoiler" data-source="《示例作品》结局">
这个角色最终揭示自己是来自未来的时间旅行者，目的是改变历史进程。
</div>

## 其他信息

这是一些额外的信息，不包含剧透。`
        
        const { frontMatter, content } = parseFrontMatter(fileContent)
        const description = extractDescription(content)
        
        return {
          id,
          content,
          description,
          title: frontMatter.title || '',
          type: frontMatter.type || '',
          tags: frontMatter.tags || [],
          related: frontMatter.related || []
        }
      }
    }
    
    return null
  } catch (error) {
    console.error(`Failed to load content: ${type}/${id}`, error)
    return null
  }
}

// 获取指定类型的所有条目列表
export async function loadContentList(type: string): Promise<ContentEntry[]> {
  // 在实际应用中，使用 import.meta.glob 加载所有匹配类型的文件
  if (type === 'characters') {
    return [
      {
        id: 'example-character',
        title: '托贝诺特',
        type: '人物',
        tags: ['主角', '创造者'],
        content: '',
        description: '托贝诺特是这个世界观的创造者，拥有操控现实的神秘力量。'
      },
      {
        id: 'sample-character',
        title: '示例角色',
        type: '人物',
        tags: ['示例', '测试'],
        content: '',
        description: '这是一个用于测试剧透功能的示例角色。'
      }
    ]
  }
  
  // 默认返回空数组
  return []
}

export function renderContent(content: string, showSpoilers = false): string {
  // 解析 Markdown 内容
  let htmlContent = md.render(content)
  
  // 处理剧透区块的样式
  if (showSpoilers) {
    // 使用更可靠的方式添加 revealed 类
    htmlContent = htmlContent.replace(
      /<div class="spoiler"/g, 
      '<div class="spoiler revealed"'
    );
    
    // 确保处理有其他类的情况
    htmlContent = htmlContent.replace(
      /<div class="spoiler revealed" data-source/g,
      '<div class="spoiler revealed" data-source'
    );
  }
  
  return htmlContent
} 