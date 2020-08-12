import React, { Component } from "react";
import ContentEditable from "react-contenteditable";
import Typer from "../modules/Typer";
import "../styles/Page.scss";
import Filler from "../resources/filler.md";
const FillerText = Typer.normalize(Filler);

class Page extends Component {
  constructor() {
    super();
    this.contentEditable = React.createRef();
    this.state = {
        previousHtml: FillerText,
        html: FillerText
    };
  }

  handleChange(e) {
    var newContent = e.target.value;
    if (newContent == this.state.previousHtml) return;
    this.state.previousHtml = newContent;
    var normalizedHtml = Typer.normalize(newContent);
    if (newContent == normalizedHtml) return;
    this.setState({ html: normalizedHtml });
  };

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
