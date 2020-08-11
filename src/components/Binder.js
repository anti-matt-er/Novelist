import React, { Component} from "react";
import "../styles/Binder.css";
import Page from "./Page"

class App extends Component {
    render() {
        return (
            <div className="binder">
                <Page />
            </div>
        );
    }
}
  
export default App;