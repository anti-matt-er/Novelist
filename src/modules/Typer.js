import SanitizeHtml from "sanitize-html";
import Marked from "marked";
import Turndown from "turndown";
Marked.setOptions({
    gfm: true,
    breaks: true,
    smartypants: true
});
const turndown = new Turndown();
const turndownPluginGfm = require('turndown-plugin-gfm');
turndown.use(turndownPluginGfm.gfm);
const sanitizePrefs = {
    allowedTags: [ 'em', 'strong', 'ul', 'ol', 'li', 'p', 'br', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'hr'],
    allowedAttributes: {}
}
const caretCode = '\uffff';

class Typer {
    constructor() {
        this.html = '';
        this.md = '';
    }

    setHtml(html) {
        this.html = html;
        this.sanitize();
        this.setMd(this.htmlToMarkdown(this.html));
        console.log(this.md);
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
        //this.fixTags();
    }

    markdownToHtml(md) {
        return Marked(md);
    }

    htmlToMarkdown(html) {
        return turndown.turndown(html);
    }

    fixTags() {
        this.html = this.html.replace(/(?<=\S)</g, ' <');
        this.html = this.html.replace(/>(?=\S)/g, '> ');
    }

    setHtmlCaret(pos) {
        this.setHtml([
            this.html.slice(0, position),
            caretCode,
            this.html.slice(position)
        ].join(''));
    }

    setMdCaret(pos) {
        this.setMd([
            this.md.slice(0, position),
            caretCode,
            this.md.slice(position)
        ].join(''));
    }

    getHtmlCaret() {
        var pos = this.html.indexOf(caretCode);
        if (pos == -1) return 0;
        this.html.replace(caretCode, '');
        this.setHtml(this.html);
        return pos;
    }

    getMdCaret() {
        var pos = this.md.indexOf(caretCode);
        if (pos == -1) return 0;
        this.md.replace(caretCode, '');
        this.setMd(this.md);
        return pos;
    }
}

export default Typer;