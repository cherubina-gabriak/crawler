import { JSDOM } from "jsdom";

function normalizeURL(urlToNirmalize) {
  const url = new URL(urlToNirmalize);

  let normalized = url.host;
  const pathname = url.pathname.endsWith("/")
    ? url.pathname.slice(0, -1)
    : url.pathname;

  return normalized + pathname;
}

function getURLsFromHTML(html, baseURL) {
  const dom = new JSDOM(html);
  const links = dom.window.document.querySelectorAll("a");
  const urls = [];

  for (const link of links) {
    if (link.hasAttribute("href")) {
      let href = link.getAttribute("href");

      try {
        href = new URL(href, baseURL).href;
        urls.push(href);
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }

  return urls;
}

async function getPage(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (e) {
    throw new Error(`Network error: ${e.message}`);
  }

  if (response.status >= 400) {
    console.log(`HTTP error code: ${response.status}`);
    return;
  }

  const contentType = response.headers.get("Content-Type");
  if (!contentType || !contentType.includes("text/html")) {
    console.log(`Non-html content type: ${contentType}`);
    return;
  }

  return response.text();
}

async function crawlPage(baseUrl, currentUrl = baseUrl, pages = {}) {
  const isSameDomain =
    new URL(currentUrl).hostname === new URL(baseUrl).hostname;

  if (!isSameDomain) {
    return pages;
  }

  const currentUrlNorm = normalizeURL(currentUrl);

  if (pages[currentUrlNorm]) {
    pages[currentUrlNorm] += 1;

    return pages;
  }

  pages[currentUrlNorm] = 1;

  console.log(`crawling ${currentUrl}`);
  let page = "";

  try {
    page = await getPage(currentUrl);
  } catch (e) {
    console.log(e.message);
    return pages;
  }

  const urls = getURLsFromHTML(page, baseUrl);

  for (const url of urls) {
    pages = await crawlPage(baseUrl, url, pages);
  }

  return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage };
