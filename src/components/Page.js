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
    this.previousHtml;
    this.contentChangeTimer;
    this.caret;
    this.state = {
        html: "",
        mistakes: [],
        displayAnnotation: -1
    };
    Rangy.init();
  }

  componentDidMount() {
    this.typer.setMd(Filler);
    this.handleContent(this.typer.getHtml());
  }

  handleChange(e) {
    let newContent = e.target.value;
    if (Typer.sanitizeHtml(newContent) == Typer.sanitizeHtml(this.previousHtml)) {
      this.storeCaret();
      this.restoreCaret();
      return;
    }
    console.log(newContent);

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
      this.storeCaret();
      this.previousHtml = annotation.annotatedHtml;
  
      this.setState({
        html: annotation.annotatedHtml,
        mistakes: annotation.mistakes
      }, this.restoreCaret);
    });
  }

  storeCaret() {
    let node = this.contentEditable.current;
    let sel = Rangy.getSelection();
    if (sel.rangeCount == 0) return;
    this.caret = sel.getRangeAt(0).toCharacterRange(node);
  }

  restoreCaret() {
    let node = this.contentEditable.current;
    let sel = Rangy.getSelection();
    if (sel.rangeCount == 0) return;
    let range = sel.getRangeAt(0);
    range.selectCharacters(node, this.caret.start, this.caret.start);
    sel.setSingleRange(range);
    node.focus();
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
    this.storeCaret();
    this.setState({
      displayAnnotation: parseInt(id)
    }, () => {
      callback();
      this.restoreCaret();
    });
  }

  hideAnnotation() {
    if (this.state.displayAnnotation == -1) return;
    this.resetMistakeStyles();
    this.storeCaret();
    this.setState({
      displayAnnotation: -1
    }, this.restoreCaret);
  }

  replaceMistake(e, suggestion) {
    console.log("replacey");
    let mistakeNode = document.querySelector(".mistake[data-annotation=\"" + this.state.displayAnnotation + "\"]");
    let replacement = document.createTextNode(suggestion);
    mistakeNode.parentNode.replaceChild(replacement, mistakeNode);
    let newHtml = this.contentEditable.current.innerHTML;
    this.handleContent(newHtml);
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
        <div key={index} className="Suggestion" onClick={(e) => this.replaceMistake(e, suggestion.value)}>{suggestion.value}</div>
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
      <div
        className="scrollWrapper"
        onClick={this.hideAnnotation.bind(this)}
      >
        {Annotation}
        <ContentEditable
          className="Page"
          spellCheck="false"
          innerRef={this.contentEditable}
          html={this.state.html}
          onChange={this.handleChange.bind(this)}
          onContextMenu={this.handleAnnotation.bind(this)}
        />
      </div>
    );
  }
}

export default Page;
