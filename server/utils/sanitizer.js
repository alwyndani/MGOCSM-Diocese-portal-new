import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

/**
 * Cleanse an HTML string from potentially malicious nodes and scripts
 * @param {string} rawHTML - Unsafe HTML content
 * @returns {string} Clean, sanitized HTML
 */
export const sanitizeHTML = (rawHTML) => {
  if (!rawHTML) return "";
  return DOMPurify.sanitize(rawHTML, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "ol", "ul", "li", "span", "div", 
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "a", "img"
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "style", "target"]
  });
};
