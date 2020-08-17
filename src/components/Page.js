import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import Rangy from "rangy";
import RangyTextRange from "rangy/lib/rangy-textrange";
import Typer from "../modules/Typer";
import Proofread from "../modules/Proofread";
import "../styles/Page.scss";
import Filler from "../resources/filler.md";

const contentChangeTimeout = 500;

document.execCommand("defaultParagraphSeparator", false, "p");

class Page extends Component {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.typer = new Typer();
    this.typer.setMd(Filler);
    var html = this.typer.getHtml();
    this.typer.setHtml(html);
    this.previousHtml = this.typer.getHtml();
    this.contentChangeTimer = null;
    this.state = {
        html: this.previousHtml,
        mistakes: [],
        displayAnnotation: -1
    };
    Rangy.init();
  }

  handleChange(e) {
    var newContent = e.target.value;
    if (newContent == this.previousHtml) {
      return;
    }

    clearTimeout(this.contentChangeTimer);
    this.contentChangeTimer = setTimeout(this.handleContent.bind(this), contentChangeTimeout, newContent);
  };

  handleContent(content) {
    this.previousHtml = content;
    this.typer.setHtml(content);
    if (content == this.typer.getHtml()) {
      return;
    }
    Proofread.checkHtml(this.typer.getHtml(), (annotation) => {
      let node = this.contentEditable.current;
      let caret = Rangy.getSelection().getRangeAt(0).toCharacterRange(node);
  
      this.setState({
        html: annotation.annotatedHtml,
        mistakes: annotation.mistakes
      }, () => {
        let annotations = this.contentEditable.current.querySelectorAll(".mistake");
        for (const annotation of annotations) {
          annotation.addEventListener("click", (e) => {
            this.showAnnotation(annotation.dataset.annotation)
            e.stopPropagation();
          });
        }
        let sel = Rangy.getSelection();
        let range = sel.getRangeAt(0);
        range.selectCharacters(node, caret.start, caret.start);
        sel.setSingleRange(range);
        node.focus();
      });
    });
  }

  showAnnotation(id) {
    console.log("Hello, an id: " + id);
    this.setState({
      displayAnnotation: parseInt(id)
    });
  }

  hideAnnotation() {
    this.setState({
      displayAnnotation: -1
    });
  }

  replaceMistake(id, suggestion) {
    // something
  }

  render() {
    let Annotation;
    if (this.state.displayAnnotation != -1) {
      let mistake = this.state.mistakes[this.state.displayAnnotation];
      let suggestions = mistake.replacements.map((suggestion, index) =>
        <div key={index} className="Suggestion" onClick={this.replaceMistake(this.state.displayAnnotation, suggestion.value)}>{suggestion.value}</div>
      );
      Annotation =
      <div className="Annotation">
        <div className="Message">{mistake.message}</div>
        {mistake.replacements.length > 0 &&
          <div className="Suggestions">{suggestions}</div>
        }
      </div>;
    }

    return (
      <div>
        {Annotation}
        <ContentEditable
          className="Page"
          spellCheck="false"
          innerRef={this.contentEditable}
          html={this.state.html}
          onChange={this.handleChange.bind(this)}
          onClick={this.hideAnnotation.bind(this)}
        />
      </div>
    );
  }
}

export default Page;
