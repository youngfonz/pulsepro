import { NextRequest, NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';

interface BookmarkMetadata {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  type: 'youtube' | 'twitter' | 'website';
}

function isUnsafeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Block non-http(s) protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) return true;

    // Block private/internal IPs and localhost
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('172.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === '[::1]'
    ) return true;

    return false;
  } catch {
    return true;
  }
}

function getBookmarkType(url: string): 'youtube' | 'twitter' | 'website' | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // YouTube detection
    if (
      hostname.includes('youtube.com') ||
      hostname.includes('youtu.be')
    ) {
      return 'youtube';
    }

    // Twitter/X detection
    if (
      hostname.includes('twitter.com') ||
      hostname.includes('x.com')
    ) {
      return 'twitter';
    }

    // Any other valid URL is a website
    return 'website';
  } catch {
    return null;
  }
}

async function fetchYouTubeMetadata(url: string): Promise<BookmarkMetadata | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      title: data.title || 'Untitled Video',
      description: data.author_name ? `By ${data.author_name}` : undefined,
      thumbnailUrl: data.thumbnail_url || undefined,
      type: 'youtube',
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}

async function fetchTwitterMetadata(url: string): Promise<BookmarkMetadata | null> {
  try {
    // First try oEmbed for basic info
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
    const oembedResponse = await fetch(oembedUrl);

    let authorName = 'Unknown';
    let tweetText = '';

    if (oembedResponse.ok) {
      const data = await oembedResponse.json();
      authorName = data.author_name || 'Unknown';

      // Extract tweet text from HTML (remove HTML tags)
      if (data.html) {
        const textMatch = data.html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
        if (textMatch) {
          tweetText = textMatch[1]
            .replace(/<[^>]*>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .trim();
        }
      }
    }

    // Try to fetch the page to get og:image for thumbnail
    let thumbnailUrl: string | undefined = undefined;
    try {
      const pageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      });

      if (pageResponse.ok) {
        const html = await pageResponse.text();

        // Extract og:image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

        if (ogImageMatch && ogImageMatch[1]) {
          thumbnailUrl = ogImageMatch[1];
        }
      }
    } catch (e) {
      console.log('Could not fetch Twitter page for thumbnail:', e);
    }

    return {
      title: tweetText ? `${authorName}: "${tweetText.substring(0, 100)}${tweetText.length > 100 ? '...' : ''}"` : `Post by ${authorName}`,
      description: `By ${authorName}`,
      thumbnailUrl,
      type: 'twitter',
    };
  } catch (error) {
    console.error('Error fetching Twitter metadata:', error);
    return null;
  }
}

async function fetchWebsiteMetadata(url: string): Promise<BookmarkMetadata | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract title (og:title > title tag)
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = ogTitleMatch?.[1] || titleTagMatch?.[1] || new URL(url).hostname;

    // Extract description (og:description > meta description)
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = ogDescMatch?.[1] || metaDescMatch?.[1];

    // Extract thumbnail (og:image)
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    let thumbnailUrl = ogImageMatch?.[1];

    // Make relative URLs absolute
    if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
      const urlObj = new URL(url);
      thumbnailUrl = thumbnailUrl.startsWith('/')
        ? `${urlObj.protocol}//${urlObj.host}${thumbnailUrl}`
        : `${urlObj.protocol}//${urlObj.host}/${thumbnailUrl}`;
    }

    return {
      title: title.trim(),
      description: description?.trim(),
      thumbnailUrl,
      type: 'website',
    };
  } catch (error) {
    console.error('Error fetching website metadata:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireUserId();
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (isUnsafeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const bookmarkType = getBookmarkType(url);

    if (!bookmarkType) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    let metadata: BookmarkMetadata | null = null;

    if (bookmarkType === 'youtube') {
      metadata = await fetchYouTubeMetadata(url);
    } else if (bookmarkType === 'twitter') {
      metadata = await fetchTwitterMetadata(url);
    } else if (bookmarkType === 'website') {
      metadata = await fetchWebsiteMetadata(url);
    }

    if (!metadata) {
      return NextResponse.json(
        {
          error: 'Failed to fetch metadata. You can still create the bookmark manually.',
          fallback: {
            title: url,
            type: bookmarkType,
          }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error in bookmark-metadata API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
