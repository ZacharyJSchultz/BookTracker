import "../App.scss";

import React from "react";

function Main() {
    return (
        <div>
            <p className="large-font">
                Welcome to BookTracker, a website that helps you organize and
                track books you've read!
            </p>
            <p className="large-font">
                To start, please click one of the navigation bar items to add,
                remove, or view inputted books!
            </p>
            <br />
            <p className="">
                For more information, please visit this website's{" "}
                <a
                    rel="noopener noreferrer"
                    href="https://github.com/ZacharyJSchultz/BookTracker"
                    target="_blank"
                >
                    GitHub link
                </a>
            </p>
        </div>
    );
}

export default Main;
