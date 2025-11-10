# BookTracker

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
   &emsp; `docker build -t booktracker .`
       <h6></h6>
       &emsp; If this command (or the next) throws an error due to lack of permissions, try running terminal as administrator and/or put 'sudo' before the command!
       <h6></h6>
3. Turn Docker image into a container:  
   &emsp; `docker run --detach --name=BookTracker -p:13306:3306 booktracker`
4. From the main project folder, run the command:  
   &emsp; `npm install`
5. Then run:  
   &emsp; `npm run dev`
6. Navigate to http://localhost:3000/ in your choice of browser (if not opened automatically by the previous command).
7. Enjoy!

This sequence of commands creates a new Docker container for the process, binding the host's port 13306 (just a random port) to the container's port 3306 (MySQL connection port), allowing connection to the DB. Then, it installs the dependencies for the front-end and back-end, before running each one.

To stop the container, use Docker Desktop or the command: `docker container stop BookTracker`  
To run the container, use Docker Desktop or the command: `docker container start BookTracker`

<br>

<b>Note:</b> All times are stored in EST (America/New_York), no matter where the program is run from. Furthermore, times are all stored in 24-hour time.

## Application Design

This application consists of three parts: a front-end React/TypeScript website, a back-end node.js server, and a MySQL database hosted on a Docker container. As I would rather not pay for hosting at this current time, each part must be hosted on the user's system (however, it would not be difficult to scale this application to online hosting).

-   The front-end website serves as the user's gateway into the application, allowing them to add, remove, and view their entries
-   The back-end server bridges the front-end to the database, transmitting information to and from each side. Adding and removing books, querying the user's current logged entries -- this server handles all the back-end logic
-   The Docker container / MySQL database provides persistent storage, maintaining the user's information even if the app is shut down and allowing for use across multiple operating systems.

### Front-End

The front-end consists of three windows or 'states'. The first is the 'Main Page', which just contains information. Then there is the 'Add Items' form, which allows you to add new books to the database. Finally, there is the 'View DB' webpage, which queries the backend database and displays the results (consisting of all the books the user has ever entered). Each page has the same Navigation Bar at the top, which contains convenient links to all three pages.

For the 'Add Items' page, the Rating and Genres are both optional inputs that are not required for the form to succeed. If the user is to select a genre, they must first select either 'Fiction' or 'Non-Fiction'; selecting either option opens up checkbox selectors for all of the different genres under that given main genre (e.g., Fiction will have Action / Adventure and Fantasy, while Non-Fiction will have Memoirs and Self Help). These genre options are predetermined by me and, as of now, cannot be changed. This page also, at the start, reads in the genres table from the back-end to display the appropriate genres available for the user to select.

The 'View DB' page displays all relevant information pertinent to the user's entry. When the page is first loaded, it receives a query consisting of both all the user's entries and the list of all genres (this list includes the genre ID, name, as well as whether the genre is Fiction, Non-Fiction, or both. As of now, all of this information is hard-coded in `booktracker.sql`). Once this data is received, it is modified into a format convenient for React to work its magic. Specifically, the front-end receives an entries array in which each entry has one row per genre, and converts this such that each entry has one row with an array of genre IDs. Likewise, it turns the list of genre objects into a mapping of GenreID to the relevant genre's information.

On the 'View DB' page, the user has various options to choose from for how to display the genres. I couldn't decide how I wanted to display the genres to the user - for this project, I wanted to keep them in the table, but I wasn't sure if I wanted many genre columns (that the user could sort by, but that make the table very long) or a single genre column listing all the genres (requires a little more reading to see all the genres, but makes the table a lot more compact). Rather than choosing one or the other, I decided instead to implement them all, and allow the user to choose which they prefer. They also have the option to show or hide fiction/non-fiction genres, as well as hiding all genres all together. Note that some genres (like Comedy or Horror) are classified as both fiction and non-fiction.

To save time for sorting operations, and further familiarize myself with JavaScript's myriad in-built functions, I use the `.sort()` method to sort the formatted entries array without having to re-query the back-end. Similarly, when an entry is removed, I first send a DELETE request to the back-end server and then use the `.filter()` method to independently filter out the removed entry, that way I save time by not needing to wait for another SELECT query (for my small-scale application, these time savings are only a tiny drop in a vast ocean, but for a larger-scale app with a massive database, this could end up saving a lot of time). Of course, if the DELETE request fails, the page will display an error instead of removing the entry, and the filtering will not occur.

### Back-End Server

The back-end server consists of the Node.js server, which utilizes the mysql2/promise library to query said database. For the most part, it's pretty straightforward, with request handlers for all the basic front-end functionality.

### Database

The database, which provides storage for and access to the user's entries, consists of four primary tables: Books, Genres, BookLog, and BookGenres, strictly adhering to BCNF standards and following good normalization practices.

-   The Books table consists of book_id (PK), title, and author attributes, where the (title, author) pair must be unique -- serving as a storage for only Books (no user information)
-   The Genres table consists of (genre_id, genre_name, fiction, nonfiction) entries -- storing the name of each genre, a numerical ID associated with it (which also serves as the PK), and 2 booleans consisting of whether the genre applies to fiction and nonfiction genres. As of now, these are predefined
-   The BookLog table stores user information, containing a book_id (PK), rating, and the date completed
-   The BookGenres table houses (book_id, genre_id) pairs, storing the genres for each book. One book can have multiple genres; consequently, the PK is the whole (book_id, genre_id) pair.

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
