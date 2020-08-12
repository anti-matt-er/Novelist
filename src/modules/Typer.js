import SanitizeHtml from "sanitize-html";
import Marked from "marked";
import Turndown from "turndown";
const turndown = new Turndown();
const sanitizePrefs = {
    allowedTags: [ 'em', 'strong', 'ul', 'ol', 'li', 'p', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'hr']
}

class Typer {
    static sanitize(html) {
        return SanitizeHtml(html, sanitizePrefs);
    }

    static markdown(text) {
        return Marked(text);
    }

    static markup(html) {
        return turndown.turndown(html);
    }

    static normalize(content) {
        return this.markdown(
            this.markup(
                this.sanitize(content)
            )
        );
    }
}

export default Typer;