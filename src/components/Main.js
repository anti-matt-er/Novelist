import React, { Component} from "react";
import "../styles/Main.scss";
import Navigation from "./Navigation"
import Binder from "./Binder"

class App extends Component {
    render() {
        return (
            <div className="Main">
                <Navigation />
                <Binder />
            </div>
        );
    }
}
  
export default App;