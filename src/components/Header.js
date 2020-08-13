import React, { Component } from "react";
import "../styles/Header.scss";
const { BrowserWindow } = window.require('electron').remote;

class Header extends Component {

    constructor(props) {
        super(props);
        this.window = BrowserWindow.getFocusedWindow();
        this.window.on("maximize", (e) => {
            this.onMaximize()
        });
        this.window.on("unmaximize", (e) => {
            this.onRestore()
        });
        this.state = {
            maximized: false
        };
    }

    minimize() {
        this.window.minimize();
    }

    maximize() {
        this.window.maximize();
    }

    restore() {
        this.window.unmaximize();
    }

    close() {
        this.window.close();
    }

    onMaximize() {
        this.setState({maximized: true});
    }

    onRestore() {
        this.setState({maximized: false});
    }

    render() {
        return (
            <div className="Header">
                <div className="title">Novelist</div>
                <nav className="window-buttons">
                    <button
                        className="min"
                        onClick={this.minimize.bind(this)}
                    >
                        &#xE921;
                    </button>
                    { this.state.maximized ?
                        <button
                            className="restore"
                            onClick={this.restore.bind(this)}
                        >
                            &#xE923;
                        </button>
                    :
                        <button
                            className="max"
                            onClick={this.maximize.bind(this)}
                        >
                            &#xE922;
                        </button>
                    }
                    <button
                        className="close"
                        onClick={this.close.bind(this)}
                    >
                        &#xE8BB;
                    </button>
                </nav>
            </div>
        );
    }
}
  
export default Header;