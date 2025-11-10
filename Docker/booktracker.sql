USE BookTracker;

DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS BookGenres;
DROP TABLE IF EXISTS BookLog;

CREATE TABLE Books(
    book_id INT UNIQUE NOT NULL AUTO_INCREMENT,
	title VARCHAR(100),
    author VARCHAR(100),
    CONSTRAINT PK_Books PRIMARY KEY (book_id),
    CONSTRAINT Unique_Books UNIQUE (title, author)
);

CREATE TABLE Genres(
	genre_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    genre_name VARCHAR(50) UNIQUE NOT NULL,
    fiction BOOLEAN NOT NULL,
    nonfiction BOOLEAN NOT NULL,
    CONSTRAINT PK_Genres PRIMARY KEY (genre_id)
);

CREATE TABLE BookGenres(
	book_id INT,
    genre_id INT,
    CONSTRAINT PK_BookGenres PRIMARY KEY (book_id, genre_id)
);

CREATE TABLE BookLog(
	book_id INT,
    rating TINYINT DEFAULT NULL,
    date_completed DATETIME,
    CONSTRAINT PK_BookLog PRIMARY KEY (book_id)
);

-- Genres and whether they are fiction / nonfiction are hard-coded (as of now)
INSERT INTO Genres (genre_name, fiction, nonfiction) VALUES
    ("Fiction", 1, 0),
    ("Non-Fiction", 0, 1),
    ("Action / Adventure", 1, 0),
    ("Comedy", 1, 1),
    ("Crime / Mystery", 1, 0),
    ("Fantasy", 1, 0),
    ("Romance", 1, 0),
    ("Science Fiction", 1, 0),
    ("Historical Fiction", 1, 0),
    ("Suspense / Thriller", 1, 0),
    ("Drama", 1, 0),
    ("Horror", 1, 0),
    ("Poetry", 1, 1),
    ("Graphic Novel", 1, 0),
    ("Young Adult", 1, 0),
    ("Children's Book", 1, 1),
    ("Comic", 1, 0),
    ("Memoir / Autobiography", 0, 1),
    ("Biography", 0, 1),
    ("Food & Drink", 0, 1),
    ("Art / Photography", 0, 1),
    ("Self Help", 0, 1),
    ("History", 0, 1),
    ("Travel", 0, 1),
    ("True Crime", 0, 1),
    ("Science / Technology", 0, 1),
    ("Humanities / Social Sciences", 0, 1),
    ("Essay", 0, 1),
    ("Guide", 0, 1),
    ("Religion / Spirituality", 0, 1),
    ("Other", 1, 1);