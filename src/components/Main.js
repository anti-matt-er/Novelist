import React, { Component} from "react";
import "../styles/Main.css";
import Navigation from "./Navigation"
import Binder from "./Binder"

class App extends Component {
    render() {
        return (
            <div className="main">
                <Navigation />
                <Binder />
            </div>
        );
    }
}
  
export default App;