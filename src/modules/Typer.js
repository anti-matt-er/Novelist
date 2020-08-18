import SanitizeHtml from "sanitize-html";
import Marked from "marked";
import Turndown from "turndown";
Marked.setOptions({
    gfm: true,
    breaks: true,
    smartypants: true
});
const turndown = new Turndown({
    emDelimiter: '*',
    bulletListMarker: '-'
});
const turndownPluginGfm = require('turndown-plugin-gfm');
turndown.use(turndownPluginGfm.gfm);
turndown.addRule('breaks', {
    filter: 'br',
    replacement: function() {
        return '<br />';
    }
});
const sanitizePrefs = {
    allowedTags: [ 'em', 'strong', 'ul', 'ol', 'li', 'p', 'br', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'hr'],
    allowedAttributes: {}
}

class Typer {
    constructor() {
        this.html = '';
        this.md = '';
    }

    setHtml(html) {
        this.html = html;
        this.setMd(this.htmlToMarkdown(this.html));
    }

    setMd(md) {
        this.md = md;
        this.html = this.markdownToHtml(md);
        this.sanitize();
    }

    getHtml() {
        return this.html;
    }

    getMd() {
        return this.md;
    }

    sanitize() {
        this.html = SanitizeHtml(this.html, sanitizePrefs);
    }

    markdownToHtml(md) {
        return Marked(md);
    }

    htmlToMarkdown(html) {
        return turndown.turndown(html);
    }

    static sanitizeHtml(html) {
        return SanitizeHtml(html, sanitizePrefs);
    }
}

export default Typer;