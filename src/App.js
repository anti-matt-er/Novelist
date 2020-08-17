import React, { Component } from "react";
import "./styles/App.scss";
import Header from "./components/Header"
import Main from "./components/Main"
import Footer from "./components/Footer"

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Main />
                <Footer />
            </div>
        );
    }
}

export default App;

function getLangCode() {
    let env = process.env;
    let rawCode = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
    return rawCode.split('.')[0].replace('_', '-');
}

console.log(getLangCode());