import axios from 'axios';
import * as cheerio from 'cheerio';

export async function extractMainContentFromUrl(url: string): Promise<string> {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const candidates = ['article', 'main', '#content', '#mw-content-text'];
  let bestText = '';
  let maxLength = 0;

  for (const selector of candidates) {
    $(selector).each((_, el) => {
      $(el)
        .find(
          'nav, footer, header, aside, script, style, .sidebar, .navbox, .infobox',
        )
        .remove();

      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > maxLength) {
        maxLength = text.length;
        bestText = text;
      }
    });
  }

  return bestText;
}
