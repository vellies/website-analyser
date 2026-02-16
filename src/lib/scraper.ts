import * as cheerio from 'cheerio';

export interface ScrapedData {
    title: string;
    description: string;
    h1: string[];
    h2: string[];
    ogImage: string;
    favicon: string;
    links: string[];
    metaTags: Record<string, string>;
    scripts: string[];
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        const h1: string[] = [];
        $('h1').each((_, el) => {
            h1.push($(el).text().trim());
        });
        const h2: string[] = [];
        $('h2').each((_, el) => {
            h2.push($(el).text().trim());
        });

        const ogImage = $('meta[property="og:image"]').attr('content') || '';
        const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';

        const links: string[] = [];
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href) links.push(href);
        });

        const metaTags: Record<string, string> = {};
        $('meta').each((_, el) => {
            const name = $(el).attr('name') || $(el).attr('property');
            const content = $(el).attr('content');
            if (name && content) {
                metaTags[name] = content;
            }
        });

        const scripts: string[] = [];
        $('script').each((_, el) => {
            const src = $(el).attr('src');
            if (src) scripts.push(src);
        });

        return {
            title,
            description,
            h1,
            h2,
            ogImage,
            favicon,
            links,
            metaTags,
            scripts,
        };
    } catch (error) {
        console.error('Scraping error:', error);
        throw error;
    }
}
