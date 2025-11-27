import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
});

/**
 * Parses markdown text to sanitized HTML
 * @param {string} text - The markdown text to parse
 * @returns {string} - Sanitized HTML string
 */
export const parseMarkdown = (text) => {
    if (!text) return '';

    const rawHtml = marked.parse(text);
    return DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['target'], // Allow target attribute for links
    });
};
