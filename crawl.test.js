import { normalizeURL, getURLsFromHTML } from "./crawl";
import { it, expect, describe } from "@jest/globals";

describe("normilizeURL", () => {
  it("normilize protocol", () => {
    const url = "https://blog.boot.dev/path";
    const normilized = normalizeURL(url);
    expect(normilized).toBe("blog.boot.dev/path");
  });

  it("normilize slash", () => {
    const url = "http://blog.boot.dev/path/";
    const normilized = normalizeURL(url);
    expect(normilized).toBe("blog.boot.dev/path");
  });

  it("normalize capitals", () => {
    const url = "http://BLOG.boot.dev/path/";
    const normilized = normalizeURL(url);
    expect(normilized).toBe("blog.boot.dev/path");
  });
});

const baseUrl = "https://base_url.com";

describe("getURLsFromHTML", () => {
  it("returns all urls", () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <body>
        <ul>
          <li><a href="https://www.google.com" target="_blank">Google</a></li>
          <li><a href="https://www.facebook.com" target="_blank">Facebook</a></li>
          <li><a href="https://www.twitter.com" target="_blank">Twitter</a></li>
          <li><a href="https://www.linkedin.com" target="_blank">LinkedIn</a></li>
          <li><a href="https://www.github.com" target="_blank">GitHub</a></li>
        </ul>
      </body>
      </html>
      `;

    const urls = getURLsFromHTML(html, baseUrl);
    const expected = [
      "https://www.google.com/",
      "https://www.facebook.com/",
      "https://www.twitter.com/",
      "https://www.linkedin.com/",
      "https://www.github.com/",
    ];

    expect(urls).toEqual(expected);
  });

  it("returns resolved relative urls", () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <body>
        <ul>
          <li><a href="https://www.google.com" target="_blank">Google</a></li>
          <li><a href="https://www.facebook.com" target="_blank">Facebook</a></li>
          <li><a href="https://www.twitter.com" target="_blank">Twitter</a></li>
          <li><a href="https://www.linkedin.com" target="_blank">LinkedIn</a></li>
          <li><a href="https://www.github.com" target="_blank">GitHub</a></li>
        </ul>
    
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="blog/index.html">Blog</a></li>
          <li><a href="portfolio/index.html">Portfolio</a></li>
        </ul>
      </body>
      </html>
    `;

    const urls = getURLsFromHTML(html, baseUrl);
    const expected = [
      "https://www.google.com/",
      "https://www.facebook.com/",
      "https://www.twitter.com/",
      "https://www.linkedin.com/",
      "https://www.github.com/",
      `${baseUrl}/about.html`,
      `${baseUrl}/contact.html`,
      `${baseUrl}/services.html`,
      `${baseUrl}/blog/index.html`,
      `${baseUrl}/portfolio/index.html`,
    ];

    expect(urls).toEqual(expected);
  });
});
