import React, { Component} from "react";
import "../styles/Binder.scss";
import Page from "./Page"

class App extends Component {
    render() {
        return (
            <div className="Binder">
                <Page />
            </div>
        );
    }
}
  
export default App;