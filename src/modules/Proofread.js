import React from 'react';
import ReactDOMServer from 'react-dom/server';
let controller = null;

class Proofread {
    static checkHtml(html, callback) {
        let parsePattern = /([^<>]+)(?=<[^<>\n]+>)/g;
        let matches = [...html.matchAll(parsePattern)];
        let text = "";
        let markupMap = [];
        let textIndex = 0;
        for (const match of matches) {
            let map = {
                begin: textIndex,
                end: textIndex + match[0].length,
                offset: match.index - textIndex
            };
            text += match[0];
            textIndex += match[0].length;
            markupMap.push(map);
        }
        let mistakes = [];
        let params = {
            language: this.getLangCode(),
            text: text,
            disabledRules: "PROFANITY"
        };
        let query = "";
        for (var key in params) {
            if (query != "") {
                query += "&";
            }
            query += key + "=" + encodeURIComponent(params[key]);
        }
        let url = encodeURI("https://languagetool.org/api/v2/check");
        controller = new AbortController();
        const signal = controller.signal;
        fetch(url, {
            method: 'post',
            body: query,
            signal: signal
        }).then(function(response) {
            response.json().then(function(data) {
                for (const match of data.matches) {
                    let index = match.offset;
                    for (var i = markupMap.length - 1; i >= 0; i--) {
                        let map = markupMap[i];
                        if (
                            index < map.begin ||
                            index > map.end
                        ) {
                            continue;
                        }
                        index += map.offset;
                        break;
                    }
                    let mistake = {
                        message: match.message,
                        replacements: match.replacements,
                        index: index,
                        length : match.length
                    };
                    mistakes.push(mistake);
                }
                let annotatedHtml = html;
                let offset = 0;
                let id = 0;
                mistakes.forEach(function (mistake) {
                    let begin = mistake.index + offset;
                    let end = mistake.index + mistake.length + offset;
                    let content = annotatedHtml.slice(begin, end);
                    let annotation = <span className="mistake" data-annotation={id}>{content}</span>
                    let annotationHtml = ReactDOMServer.renderToString(annotation);
                    annotatedHtml = annotatedHtml.slice(0, begin) + annotationHtml + annotatedHtml.slice(end);
                    offset += annotationHtml.length - content.length;
                    id += 1;
                });
                controller = null;
                callback({
                    annotatedHtml: annotatedHtml,
                    mistakes: mistakes
                });
            });
        }).catch((e) => {
            console.log(e);
        });
    }

    static abortCheck() {
        if (controller) {
            controller.abort();
        }
    }

    static getLangCode() {
        let env = process.env;
        let rawCode = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
        return rawCode.split('.')[0].replace('_', '-');
    }
}

export default Proofread;