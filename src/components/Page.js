import React, { Component } from "react";
import "../styles/Page.scss";
import Filler from "../resources/filler.md";

var fillerHtml = {__html: Filler};

class App extends Component {
    render() {
        return (
            <div className="Page" contentEditable spellCheck="false" dangerouslySetInnerHTML={fillerHtml} />
        );
    }
}
  
export default App;