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
    this.annotation = React.createRef();
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
        let sel = Rangy.getSelection();
        let range = sel.getRangeAt(0);
        range.selectCharacters(node, caret.start, caret.start);
        sel.setSingleRange(range);
        node.focus();
      });
    });
  }

  handleAnnotation(e) {
    let node = e.target;
    if (node.classList.contains("mistake")) {
      let targetRect = node.getBoundingClientRect();
      this.showAnnotation(node.dataset.annotation, () => {
        this.annotation.current.style.top = targetRect.bottom + "px";
        this.annotation.current.style.left = targetRect.left + "px";
        node = document.querySelector(".mistake[data-annotation=\"" + node.dataset.annotation + "\"]");
        node.classList.add("annotating");
      });
    } else {
      this.hideAnnotation();
    }
  }

  showAnnotation(id, callback) {
    this.resetMistakeStyles();
    this.setState({
      displayAnnotation: parseInt(id)
    }, () => {
      callback();
    });
  }

  hideAnnotation() {
    this.resetMistakeStyles();
    this.setState({
      displayAnnotation: -1
    });
  }

  replaceMistake(id, suggestion) {
    // something
  }

  resetMistakeStyles() {
    let mistakes = document.querySelectorAll(".mistake");
    for (const mistake of mistakes) {
      mistake.classList.remove("annotating");
    }
  }

  render() {
    let Annotation;
    if (this.state.displayAnnotation != -1) {
      let mistake = this.state.mistakes[this.state.displayAnnotation];
      let suggestions = mistake.replacements.map((suggestion, index) =>
        <div key={index} className="Suggestion" onClick={this.replaceMistake(this.state.displayAnnotation, suggestion.value)}>{suggestion.value}</div>
      );
      Annotation =
      <div className="Annotation" ref={this.annotation}>
        <div className="Message">{mistake.message}</div>
        {mistake.replacements.length > 0 &&
          <div className="Suggestions">{suggestions}</div>
        }
      </div>;
    }

    return (
      <div className="scrollWrapper">
        {Annotation}
        <ContentEditable
          className="Page"
          spellCheck="false"
          innerRef={this.contentEditable}
          html={this.state.html}
          onChange={this.handleChange.bind(this)}
          onClick={this.hideAnnotation.bind(this)}
          onContextMenu={this.handleAnnotation.bind(this)}
        />
      </div>
    );
  }
}

export default Page;
