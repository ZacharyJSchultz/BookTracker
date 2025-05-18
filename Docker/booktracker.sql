USE BookTracker;

DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS BookGenres;
DROP TABLE IF EXISTS BookLog;

CREATE TABLE Books(
    book_id INT UNIQUE NOT NULL AUTO_INCREMENT,
	title VARCHAR(50),
    author VARCHAR(50),
    CONSTRAINT PK_Books PRIMARY KEY (book_id),
    CONSTRAINT Unique_Books UNIQUE (title, author)
);

CREATE TABLE Genres(
	genre_id INT UNIQUE NOT NULL AUTO_INCREMENT,
    genre_name VARCHAR(50) UNIQUE NOT NULL,
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
    dateCompleted DATETIME,
    CONSTRAINT PK_BookLog PRIMARY KEY (book_id)
);

INSERT INTO Genres (genre_name) VALUES
    ("Fiction"),
    ("Non-Fiction"),
    ("Action / Adventure"),
    ("Comedy"),
    ("Crime / Mystery"),
    ("Fantasy"),
    ("Romance"),
    ("Science Fiction"),
    ("Historical Fiction"),
    ("Suspense / Thriller"),
    ("Drama"),
    ("Horror"),
    ("Poetry"),
    ("Graphic Novel"),
    ("Young Adult"),
    ("Children's Book"),
    ("Comic"),
    ("Memoir / Autobiography"),
    ("Biography"),
    ("Food & Drink"),
    ("Art / Photography"),
    ("Self Help"),
    ("History"),
    ("Travel"),
    ("True Crime"),
    ("Science / Technology"),
    ("Humanities / Social Sciences"),
    ("Essay"),
    ("Guide"),
    ("Religion / Spirituality"),
    ("Other");