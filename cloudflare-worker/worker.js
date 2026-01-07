/**
 * Cloudflare Worker - Notion API Proxy
 *
 * 이 워커는 GitHub Pages에서 Notion API를 안전하게 호출하기 위한 프록시입니다.
 * Notion API 키를 클라이언트에 노출하지 않고 서버사이드에서 처리합니다.
 *
 * 환경변수 설정 필요:
 * - NOTION_API_KEY: Notion Integration 토큰
 * - NOTION_DATABASE_ID: 일기/메모 데이터베이스 ID
 * - ALLOWED_ORIGIN: 허용할 도메인 (예: https://davidclimbing.github.io)
 */

export default {
  async fetch(request, env) {
    // CORS 프리플라이트 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(env.ALLOWED_ORIGIN),
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 일기/메모 목록 조회
      if (path === '/api/entries' && request.method === 'GET') {
        return await getEntries(env);
      }

      // 특정 일기/메모 조회
      if (path.startsWith('/api/entries/') && request.method === 'GET') {
        const pageId = path.split('/')[3];
        return await getEntry(pageId, env);
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders(env.ALLOWED_ORIGIN), 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders(env.ALLOWED_ORIGIN), 'Content-Type': 'application/json' },
      });
    }
  },
};

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function getEntries(env) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${env.NOTION_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [{ property: 'Date', direction: 'descending' }],
        page_size: 100,
      }),
    }
  );

  const data = await response.json();

  // 필요한 데이터만 추출하여 반환
  const entries = data.results?.map((page) => ({
    id: page.id,
    title: page.properties.Title?.title?.[0]?.plain_text || '제목 없음',
    date: page.properties.Date?.date?.start || null,
    emoji: page.icon?.emoji || '📝',
    tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
    preview: page.properties.Preview?.rich_text?.[0]?.plain_text || '',
  })) || [];

  return new Response(JSON.stringify({ entries }), {
    headers: { ...corsHeaders(env.ALLOWED_ORIGIN), 'Content-Type': 'application/json' },
  });
}

async function getEntry(pageId, env) {
  // 페이지 정보 가져오기
  const pageResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      'Authorization': `Bearer ${env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    },
  });
  const page = await pageResponse.json();

  // 페이지 블록(내용) 가져오기
  const blocksResponse = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
    {
      headers: {
        'Authorization': `Bearer ${env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    }
  );
  const blocksData = await blocksResponse.json();

  const entry = {
    id: page.id,
    title: page.properties.Title?.title?.[0]?.plain_text || '제목 없음',
    date: page.properties.Date?.date?.start || null,
    emoji: page.icon?.emoji || '📝',
    tags: page.properties.Tags?.multi_select?.map((tag) => tag.name) || [],
    blocks: blocksData.results?.map(parseBlock) || [],
  };

  return new Response(JSON.stringify({ entry }), {
    headers: { ...corsHeaders(env.ALLOWED_ORIGIN), 'Content-Type': 'application/json' },
  });
}

function parseBlock(block) {
  const type = block.type;
  const content = block[type];

  switch (type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'heading_1':
      return {
        type: 'h1',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'heading_2':
      return {
        type: 'h2',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'heading_3':
      return {
        type: 'h3',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'bulleted_list_item':
      return {
        type: 'bullet',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'numbered_list_item':
      return {
        type: 'number',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'quote':
      return {
        type: 'quote',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
      };
    case 'code':
      return {
        type: 'code',
        text: content.rich_text?.map((t) => t.plain_text).join('') || '',
        language: content.language || 'plaintext',
      };
    case 'image':
      return {
        type: 'image',
        url: content.file?.url || content.external?.url || '',
        caption: content.caption?.map((t) => t.plain_text).join('') || '',
      };
    case 'divider':
      return { type: 'divider' };
    default:
      return { type: 'unsupported', originalType: type };
  }
}
