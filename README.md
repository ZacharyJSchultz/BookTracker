# BookTracker

## Note: This project is currently under development to improve the underlying functionality; it should be finished soon.

![View DB Screenshot](/screenshots/view_db.png?raw=true)

Author: [Zachary Schultz](https://www.linkedin.com/in/~zachary/) | zjs32@pitt.edu

## Purpose:

The purpose of this project is to create a website that allows me to input books, so I can keep track of everything I've already read in a nicely organized and easily accessible manner. I'm an avid reader, and I've long struggled with the problem of remembering if I've read a book or not, so I plan to develop a website (hooked up to a back-end database for storage) to solve this problem.

The goal of this project—from a coding standpoint—is to create a website seamlessly integrated with a functional back-end database. In particular, I would like to practice/advance my web development and database management skills, as well as learn about commonly used frameworks and gain experience working with new DBMSs. Lastly, I also want to gain experience creating a fully-functional project from scratch, encompassing multiple different components (in this case, a front-end website and back-end databse).

## Specifications:

The website will have both a form to input books, as well as a main page to view the already-read books. The database will store the book name and author name as the PK, as well as optional genre and rating categories. The site should also store the date the book was completed (defaulting to the date of the entry). Lastly, there should be a way to delete entries from the website, on the off chance an entry was mistaken.

## How To Run:
To run this program, you must have Docker (either the desktop version or terminal) installed.

To install Docker: https://docs.docker.com/get-docker/

Once Docker is installed, follow these steps:  

1. Navigate to the docker folder
   
2. Turn Dockerfile into an image:  
   &emsp; ```docker build -t booktracker .```  
   <h6></h6>
   &emsp; If this command (or the next) throws an error due to lack of permissions, try running terminal as administrator and/or put 'sudo' before the command!
   <h6></h6>
3. Turn Docker image into a container:  
    &emsp; ```docker run --detach --name=BookTracker -p:13306:3306 booktracker```  
4. Navigate to the client folder, and run the command:  
    &emsp; ```npm install```
5. Navigate to the server folder, and run the command:  
    &emsp; ```npm install```
6. From the server folder, run the command:  
    &emsp; ```npm start```
7. From a new terminal window, navigate back to the client folder, and run the command:  
    &emsp; ```npm start```
8. Navigate to http://localhost:3000/ in your choice of browser (if not opened automatically by the previous command).
9. Enjoy!  

This sequence of commands creates a new Docker container for the process, binding the host's port 13306 (just a random port) to the container's port 3306 (MySQL connection port), allowing connection to the DB. Then, it installs the dependencies for the front-end and back-end, before running each one.

To stop the container, use Docker Desktop or the command: ```docker container stop BookTracker```  
To run the container, use Docker Desktop or the command: ```docker container start BookTracker```

<br>

<b>Note:</b> All times are stored in EST (America/New_York), no matter where the program is run from. Furthermore, times are all stored in 24-hour time.

## Design

For this app, I am chiefly designing it more as a model for a much larger, full-fledged application, as opposed to optimizing its current use.
Essentially, I am designing it with scaling (to millions or even billions of books, and countless users) prioritized over usability. However, as of now, the application only supports a single user, and there is no Books database populated with billions of entries to pull from.

For instance, in the current design, the user cannot remove a book from the Books table once it has been added, nor can they alter previously submitted genres for a book (because in a theoretical application, the user would have no control over the Books table, nor the genres it is classified as. But as I don't have a database to pull Books from, I rely on the users to manually input Books and Genres).

### Database

The database consists of four primary tables: Books, Genres, BookLog, and BookGenres, adhering to BCNF and following good normalization practices. 

- The Books table consists of book_id, title, and author attributes, where the (title, author) pair must be unique -- serving as a storage for only Books (no user information)
- The Genres table consists of (genre_id, genre_name) pairs -- storing the name of each genre and a numerical ID associated with it. As of now, these are predefined
- The BookLog table stores user information, containing a book_id, rating, and the date completed
- The BookGenres table houses (book_id, genre_id) pairs, storing the genres for each book. One book can have multiple genres.

### Application (System Design)

This application consists of three parts: a front-end React/TypeScript website, a back-end node.js server, and a MySQL database hosted on a Docker container. As I would rather not pay for hosting at this current time, each part must be hosted on the user's system (however, it would not be difficult to scale this application to online hosting).

- The front-end website serves as the user's gateway into the application, allowing them to add, remove, and view their entries
- The back-end server bridges the front-end to the database, transmitting information to and from each side. Adding and removing books, querying the user's current logged entries -- this server handles all the back-end logic.
- The Docker container / MySQL database provides persistent storage, maintaining the user's information even if the app is shut down.

## Screenshots

#### Home Page
![Home Page Screenshot](/screenshots/home_page.png?raw=true)  

#### Add Book
![Add Book Screenshot](/screenshots/add_book_form.png?raw=true)
![Add Book Complete Screenshot](/screenshots/add_book_form_success.png?raw=true)

#### View Database / Sorting

Sorted by date:
![View DB Date-sorted Screenshot](/screenshots/view_db_datesort.png?raw=true)

Sorted by title:
![View DB Title-sorted Screenshot](/screenshots/view_db_titlesort.png?raw=true)

#### Remove Item:
![Remove Item Screenshot](/screenshots/remove_item.png?raw=true)
![Remove Item Success Screenshot](/screenshots/remove_item_success.png?raw=true)
