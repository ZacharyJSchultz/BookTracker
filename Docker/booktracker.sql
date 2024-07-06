USE BookTracker;

DROP TABLE IF EXISTS Books;

CREATE TABLE Books(
	title VARCHAR(50) NOT NULL,
    author VARCHAR(50) NOT NULL,
    genres VARCHAR(50) DEFAULT NULL,
    rating TINYINT DEFAULT NULL,
    dateCompleted DATETIME,
    CONSTRAINT PK_Books PRIMARY KEY (title, author)
);