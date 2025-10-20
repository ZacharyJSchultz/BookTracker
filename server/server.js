const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const { forkJoin, take, from } = require("rxjs");

const app = express();

const getBookIdQuery = "SELECT book_id FROM Books where title=? AND author=?";
const insertBooksQuery = "INSERT INTO Books (title, author) VALUES (?, ?)";
const checkBookExistsQuery =
    "SELECT book_id FROM Books WHERE title = ? AND author = ?";
const insertBookGenresQuery = "INSERT INTO BookGenres VALUES (?, ?)";
const insertBookLogQuery = "INSERT INTO BookLog VALUES (?, ?, NOW())";
const removeBookGenresQuery = "DELETE FROM BookGenres WHERE book_id = ?";
const removeBookLogQuery = "DELETE FROM BookLog WHERE book_id = ?";

// A very long and complicated query involving multiple joins to combine the BookLog & Books and BookGenres & Genres tables, and then to combine those two tables as well, to finally obtain a table of title, author, genre, rating, and date_completed (where each genre of a given book has its own row)
const fetchQuery =
    "SELECT BL.book_id, BL.title, BL.author, G.genre_id, BL.rating, BL.date_completed FROM ((SELECT * FROM BookGenres WHERE book_id IN (SELECT book_id FROM BookLog)) AS G RIGHT JOIN (SELECT BL.book_id, title, author, rating, date_completed FROM (BookLog as BL LEFT JOIN Books as B ON BL.book_id = B.book_id)) AS BL ON G.book_id = BL.book_id) ORDER BY BL.date_completed DESC";
const fetchGenresQuery = "SELECT * FROM Genres"; // Simple query to obtain genre_id -> genre_name mapping (for sending to front-end)

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const GENRES_MAP = {
    Fiction: 1,
    NonFiction: 2,
    ActionAdventure: 3,
    Comedy: 4,
    CrimeMystery: 5,
    Fantasy: 6,
    Romance: 7,
    ScienceFiction: 8,
    HistoricalFiction: 9,
    SuspenseThriller: 10,
    Drama: 11,
    Horror: 12,
    Poetry: 13,
    GraphicNovel: 14,
    YoungAdult: 15,
    ChildrensBook: 16,
    Comic: 17,
    MemoirAutobiography: 18,
    Biography: 19,
    FoodDrink: 20,
    ArtPhotography: 21,
    SelfHelp: 22,
    History: 23,
    Travel: 24,
    TrueCrime: 25,
    ScienceTechnology: 26,
    HumanitiesSocialSciences: 27,
    Essay: 28,
    Guide: 29,
    ReligionSpirituality: 30,
    Other: 31
};

async function main() {
    const con = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        port: 13306,
        database: "BookTracker"
    });

    /*
     *
     * Steps:
     *  1. Check if Book already exists in Books table.
     *  2. If it does, add to BookGenres and BookLog (unless it already exists in BookLog).
     *     If it doesn't, add to Books and BookGenres, then add to BookLog.
     *
     *  BookGenres is updated even if the book already exists in Books, meaning that books are classified as the conglomeration of all genres
     *  they are assigned. For more information on why this is the case, see the 'Design' section of the README, where I briefly cover the
     *  thought process behind this choice (and more).
     */
    app.post("/submit-form", async (req, res) => {
        try {
            const formData = req.body;
            console.log(formData);

            // Write to file, used for testing
            /*const filePath = path.join(__dirname, "form-data.json");      // Store form data to file
            fs.writeFile(filePath, JSON.stringify(formData, null, 2), (err) => {
                if (err) {
                    console.log("Error writing file:", err);
                    return res.status(500).send("Error writing file");
                }
            });*/

            const [checkBookExistsQueryResults] = await con.execute(
                checkBookExistsQuery,
                [formData.title, formData.author]
            );
            let bookID;

            // Begin transaction, to allow for rollbacks in the case of errors
            con.beginTransaction();

            // If length is 0, then book does NOT exist in Books. Thus, add it
            if (checkBookExistsQueryResults.length === 0) {
                console.log(
                    formData.title,
                    "by",
                    formData.author,
                    "does not exist in Books! Adding to table..."
                );

                const [insertBooksResults] = await con.execute(
                    insertBooksQuery,
                    [formData.title, formData.author]
                );
                bookID = insertBooksResults.insertId;

                console.log(
                    "Successfully written to Books:",
                    "\nID:",
                    bookID,
                    "\nTitle:",
                    formData.title,
                    "\nAuthor(s):",
                    formData.author
                );
            } else {
                bookID = checkBookExistsQueryResults[0].book_id;
            }

            // Add Book to BookGenres (even if it already exists, as the user could assign it new genres)
            for (const key in formData) {
                // If the key is a boolean (i.e., a genre) and true (meaning the genre should be added to BookGenres)
                if (typeof formData[key] === "boolean" && formData[key]) {
                    try {
                        await con.execute(insertBookGenresQuery, [
                            bookID,
                            GENRES_MAP[key]
                        ]);

                        console.log(
                            "Successfully written to BookGenres:",
                            "\nBook_ID:",
                            bookID,
                            "\nGenre:",
                            key
                        );
                    } catch (err) {
                        if (err.code === "ER_DUP_ENTRY")
                            console.log(
                                "Genre",
                                key,
                                "already exists for",
                                formData.title,
                                ". Moving on..."
                            );
                        // Don't throw error if genre already exists, just continue adding...
                        else {
                            // If there is a non-duplicate error, throw an error so changes are rolled back (book won't be added to Books table)
                            console.error(
                                "Error adding genre",
                                key,
                                "to",
                                formData.title,
                                ":",
                                err.stack
                            );
                            throw err;
                        }
                    }
                }
            }

            // Add to BookLog
            try {
                await con.execute(insertBookLogQuery, [
                    bookID,
                    formData.rating || 0
                ]);

                console.log(
                    "Successfully written to BookLog:",
                    "\nBook_ID:",
                    bookID,
                    "\nRating:",
                    formData.rating || 0
                );

                con.commit(); // Commit transaction, assuming no (non-duplicate) errors
                return res.status(200).send("Form successfully submitted");
            } catch (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    console.log(
                        formData.title,
                        "by",
                        formData.author,
                        "has already been logged!"
                    ); // Don't throw error if book already exists, just add new genres
                    con.commit(); // Commit transaction
                    return res
                        .status(501)
                        .send("Error! Failed to log book: duplicate entry");
                } else {
                    console.error(
                        "Error adding book",
                        formData.title,
                        "by",
                        formData.author,
                        "to log!"
                    );
                    throw err;
                }
            }
        } catch (err) {
            console.log("Error executing query:", err.stack);
            con.rollback();
            return res
                .status(500)
                .send("Error! Failed to insert book into database");
        }
    });

    // Handle the fetching of data, sending it to front-end to display in table
    app.get("/view-db", async (req, res) => {
        try {
            const booksObs = from(con.query(fetchQuery));
            const genreObs = from(con.query(fetchGenresQuery));
            forkJoin([booksObs, genreObs])
                .pipe(take(1))
                .subscribe(([books, genreMap]) => {
                    const rslt = [books[0], genreMap[0]];
                    return res.status(200).json(rslt);
                });
        } catch (err) {
            console.log("Error fetching data:", err.stack);
            return res.status(500).send("Error fetching data");
        }
    });

    /* Handle the removal of an item
     *
     * Steps:
     *  1. Grab book_id from Books
     *  2. Remove Book from BookLog
     *  3. Remove Book from BookGenres (all instances of it with the relevant book_id)
     *
     *  Note: The book is not deleted from Books; it can just be reused if it is ever re-added.
     *  Likewise, the reason the book is deleted from BookGenres is so the user can switch the
     *  genres if they ever re-add the book.
     */
    app.delete("/remove-item", async (req, res) => {
        try {
            con.beginTransaction();

            const bookInfo = await con.execute(
                getBookIdQuery,
                [req.body.title, req.body.author],
                (err) => {
                    if (err) {
                        console.log("Error getting book_id from Books:", err);
                        return res.status(500).send("Error removing item");
                    }
                }
            );

            const bookID = bookInfo[0]?.[0]?.book_id;
            if (!bookID) throw new Error("Error getting book_id from Books");

            con.execute(removeBookLogQuery, [bookID], (err) => {
                if (err) {
                    console.log("Error removing item from BookLog:", err);
                    return res.status(500).send("Error removing item");
                }
            });

            con.execute(removeBookGenresQuery, [bookID], (err) => {
                if (err) {
                    console.log("Error removing item from BookGenres:", err);
                    return res.status(500).send("Error removing item");
                }
            });

            con.commit();
            return res.status(200).send("Entry successfully removed");
        } catch (err) {
            console.log("Error removing item:", err);
            return res.status(500).send("Error removing item");
        }
    });

    /*app.get("/message", (req, res) => {
        res.json({ message: "This is a test!" });
    });*/

    app.listen(8000, () => {
        console.log(`Server is running on port 8000.`);
    });
}

// Call main
main().catch(console.error);
