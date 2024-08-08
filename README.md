# BookTracker

Author: zjs32@pitt.edu

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
3. Turn Docker image into a container:  
    &emsp; ```docker run --detach --name=BookTracker -p:13306:3306 booktracker```  
4. Navigate to the client folder, and run the command:  
    &emsp; ```npm install```
5. Navigate to the server folder, and run the command:
    &emsp; ```npm install```  
6. From the server folder, run the command:
    &emsp; ```npm start``` 
7. Navigate back to the client folder, and run the command:
    &emsp; ```npm start``` 
8. Navigate to http://localhost:3000/ in your choice of browser (if not opened automatically by the previous command)
9. Enjoy!  

This sequence of commands creates a new Docker container for the process, binding the host's port 13306 (just a random port) to the container's port 3306 (MySQL connection port), allowing connection to the DB. Then, it installs the dependencies for the front-end and back-end, before running each one.

To stop the container, use Docker Desktop or the command: ```docker container stop BookTracker```  
To run the container, use Docker Desktop or the command: ```docker container start BookTracker```
