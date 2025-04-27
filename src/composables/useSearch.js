import { ref, onMounted } from 'vue';
import lunr from 'lunr';

// Initialize lunr with Chinese support for loading the index and searching
// lunrStemmerSupport(lunr);
// lunrZh(lunr);

// --- Helper function to resolve paths ---
const BASE_URL = import.meta.env.BASE_URL;
function resolveAssetPath(path) {
  if (!path || !path.startsWith('/')) {
    return path; // Return as is if null, undefined, or not root-relative
  }
   // Prevent double slashes if BASE_URL is '/' or path is just '/'
  const normalizedBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  const finalUrl = `${normalizedBase}${normalizedPath}`;
  // console.log(`Resolving asset path: ${path} -> ${finalUrl}`); // Optional debug log
  return finalUrl;
}
// --- End helper function ---

// Refs to hold the index, map, and loading state
const searchIndex = ref(null);
const documentMap = ref(null);
const isLoadingIndex = ref(false);
const indexLoaded = ref(false);
const loadError = ref(null);

// Function to fetch and load the index and map
async function loadSearchIndex() {
  if (indexLoaded.value || isLoadingIndex.value) {
    return; // Already loaded or loading
  }

  isLoadingIndex.value = true;
  loadError.value = null;
  console.log('Attempting to load search index...');

  try {
    // --- Use resolved paths for fetching ---
    const indexUrl = resolveAssetPath('/search-index.json');
    const mapUrl = resolveAssetPath('/search-map.json');
    console.log(`Fetching index from: ${indexUrl}`);
    console.log(`Fetching map from: ${mapUrl}`);

    const [indexResponse, mapResponse] = await Promise.all([
      fetch(indexUrl),
      fetch(mapUrl)
    ]);
    // --- End path usage change ---

    if (!indexResponse.ok) {
      throw new Error(`Failed to fetch ${indexUrl}: ${indexResponse.statusText}`);
    }
    if (!mapResponse.ok) {
        throw new Error(`Failed to fetch ${mapUrl}: ${mapResponse.statusText}`);
    }

    const [indexData, mapData] = await Promise.all([
        indexResponse.json(),
        mapResponse.json()
    ]);

    console.log('Search index and map JSON loaded successfully.');

    // Load the index into lunr (it now understands the Chinese structure)
    searchIndex.value = lunr.Index.load(indexData);
    documentMap.value = mapData; // Store the simple map
    indexLoaded.value = true;
    console.log('Lunr index loaded and ready.');

  } catch (error) {
    console.error('Error loading search index or map:', error);
    loadError.value = '无法加载搜索索引，请稍后重试或联系管理员。'; // User-friendly error message
  } finally {
    isLoadingIndex.value = false;
  }
}

// 增强的中文分词函数
function enhancedChineseTokenizer(query) {
  // 原始查询（保持完整短语）
  const tokens = [query.trim()];
  
  // 按空格分割（保持英文单词和短语）
  const spaceTokens = query.trim().split(/\s+/);
  
  spaceTokens.forEach(token => {
    // 对每个部分，如果包含中文字符
    if (/[\u4e00-\u9fa5]/.test(token)) {
      // 1. 加入原始token (如 "卡斯帕")
      tokens.push(token);
      
      // 2. 双字组合 (如 "卡斯", "斯帕")
      if (token.length >= 2) {
        for (let i = 0; i < token.length - 1; i++) {
          tokens.push(token.substring(i, i + 2));
        }
      }
      
      // 3. 三字组合 (如 "卡斯帕")
      if (token.length >= 3) {
        for (let i = 0; i < token.length - 2; i++) {
          tokens.push(token.substring(i, i + 3));
        }
      }
      
      // 4. 单字 (如 "卡", "斯", "帕")
      for (let i = 0; i < token.length; i++) {
        const char = token[i];
        if (/[\u4e00-\u9fa5a-zA-Z0-9]/.test(char)) {
          tokens.push(char);
        }
      }
    } else {
      // 非中文词直接加入
      tokens.push(token);
      
      // 添加前缀通配符搜索 (如 "cas*")
      if (token.length >= 2) {
        tokens.push(token + '*');
      }
    }
  });
  
  // 去重
  return [...new Set(tokens)];
}

export function useSearch() {
  // Trigger index loading when the composable is first used
  // Use onMounted to ensure it runs client-side
  onMounted(() => {
    if (!indexLoaded.value) {
      loadSearchIndex();
    }
  });

  // The search function
  const search = (query) => {
    if (!indexLoaded.value || !searchIndex.value || !documentMap.value || !query) {
        return [];
    }

    const trimmedQuery = query.trim();
    console.log(`Searching for: "${trimmedQuery}"`);

    try {
        let finalQueryString = '';

        // 按空格分割查询（未来可支持多词搜索）
        const terms = trimmedQuery.split(/\s+/);

        const queryParts = [];

        terms.forEach(term => {
            if (!term) return; // 跳过空术语

            if (/[\u4e00-\u9fa5]/.test(term)) {
                // --- 中文术语策略 ---
                // 1. 精确匹配（高权重）
                queryParts.push(`${term}^10`);
                // 2. 通配符前缀匹配（中等权重）
                queryParts.push(`${term}*^5`);
                // 3. 单字 OR 匹配（低权重，仅当词长>1时添加）
                if (term.length > 1) {
                    const chars = Array.from(term);
                    queryParts.push(`(${chars.join(' OR ')})^1`);
                } else {
                    // 单字搜索时，精确匹配已包含自身，通配符也包含
                }
            } else {
                // --- 英文术语策略 (示例) ---
                // 1. 精确匹配（高权重）
                queryParts.push(`${term}^10`);
                // 2. 通配符前缀匹配（中等权重）
                queryParts.push(`${term}*^5`);
                // 3. 模糊匹配（低权重, 允许1个编辑距离）
                queryParts.push(`${term}~1^1`);
            }
        });

        // 将所有策略部分用空格连接（Lunr 默认 OR，但因为我们加了权重和通配符，效果接近 AND + OR）
        finalQueryString = queryParts.join(' ');

        console.log(`Processed query: "${finalQueryString}"`);
        const results = searchIndex.value.search(finalQueryString);

        // 返回结果并排序
        return results
            .map(result => {
               const docInfo = documentMap.value[result.ref];
               const refParts = result.ref.split('/');
               const type = refParts[0];
               const actualFullId = refParts.slice(1).join('/');

               return {
                 id: result.ref,
                 score: result.score,
                 title: docInfo ? docInfo.title : '未知标题',
                 type: docInfo ? docInfo.type : type,
                 path: docInfo ? `/entry/${type}/${actualFullId}` : '/'
               };
            })
            .sort((a, b) => b.score - a.score); // 按分数降序排列
    } catch (error) {
        console.error('Error performing search:', error);
        return [];
    }
  };

  return {
    search,
    isLoadingIndex,
    indexLoaded,
    loadError,
    // Expose the load function in case manual triggering is needed
    loadSearchIndex
  };
} 