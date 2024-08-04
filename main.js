import { argv } from "node:process";
import { crawlPage } from "./crawl.js";

async function main() {
  if (argv.length <= 2) {
    console.log("No website provided");
    return;
  }

  if (argv.length > 3) {
    console.log("Too many arguments provided");
    return;
  }

  const baseUrl = argv[2];

  console.log(`crawling at ${baseUrl}....`);
  const pages = await crawlPage(baseUrl);
  console.log(pages);
}

main();
