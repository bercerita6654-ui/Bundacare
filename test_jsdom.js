import { JSDOM, VirtualConsole } from 'jsdom';
import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => {
  console.error("JSDOM Error:", error.message, error.detail);
});

const dom = new JSDOM(html, { runScripts: "dangerously", virtualConsole });
console.log("JSDOM loaded");
