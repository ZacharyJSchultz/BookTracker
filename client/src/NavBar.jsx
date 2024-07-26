import * as React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
    
    return (
        <body>
            <nav class="navbar navbar-expand-sm navbar-light bg-primary">
                <div class="container-fluid">
                        <Link to="" class="navbar-brand" style={{color:"white", fontWeight:"bold"}}>BookTracker</Link>
                    <ul class="navbar-nav">
                        <li class="navbar-item px-2"><Link to="/viewdb" class="nav-link" style={{color:"white", fontWeight:"500"}}>View Read Books</Link></li>
                        <li class="navbar-item px-2"><Link to="/additem" class="nav-link" style={{color:"white", fontWeight:"500"}}>Add Books</Link></li>
                        <li class="navbar-item px-2"><Link to="/remitem" class="nav-link" style={{color:"white", fontWeight:"500"}}>Remove Books</Link></li>
                    </ul>
                </div>
            </nav>

            <div id="viewdb">
                <p style={{fontSize:"24px"}}>Welcome to BookTracker, a website that helps you organize and track books you've read!</p>
                <p />
                <p style={{fontSize:"24px"}}>To start, please click one of the navigation bar items to 
                    add, remove, or view inputted books!</p>
                <br />
                <p style={{fontSize:"16px"}}>For more information, please visit this website's <a href="https://github.com/ZacharyJSchultz/BookTracker" target="_blank">GitHub link</a></p>
            </div> {/*TODO MOVE TO NEW CONTAINER THAT ONLY DISPLAYS ON TITLE PAGE*/}
        </body>
    );
};

export default NavBar;