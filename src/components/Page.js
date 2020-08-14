import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import Rangy from "rangy";
import RangyTextRange from "rangy/lib/rangy-textrange";
import Typer from "../modules/Typer";
import "../styles/Page.scss";
import Filler from "../resources/filler.md";

const contentChangeTimeout = 500;

class Page extends Component {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.typer = new Typer();
    this.typer.setMd(Filler);
    this.previousHtml = this.typer.getHtml();
    this.contentChangeTimer = null;
    this.state = {
        html: this.previousHtml
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

    let node = this.contentEditable.current;
    let caret = Rangy.getSelection().getRangeAt(0).toCharacterRange(node);

    this.setState({
      html: this.typer.getHtml()
    }, () => {
      let sel = Rangy.getSelection();
      let range = sel.getRangeAt(0);
      range.selectCharacters(node, caret.start, caret.start);
      sel.setSingleRange(range);
      node.focus();
    });
  }

  render() {
    return (
      <ContentEditable
        className="Page"
        spellCheck="false"
        innerRef={this.contentEditable}
        html={this.state.html}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}

export default Page;
