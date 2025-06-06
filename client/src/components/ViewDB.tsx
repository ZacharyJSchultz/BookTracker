import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import Modal from './Modal';
import Alert from './Alert';
import TableHeaderElement from './TableHeaderElement';
import Radio from './Radio';

// TODO: Idea: Add another mode/version of the table that, instead of having a col for each genre, instead lists all the genres for
// an entry in a single "genres" column (like before). This mode could be switched to with a switch, possiblei n the navbar when viewDB is selected

export interface FormattedDataRow {
    display_id: number  // This is different from the book_id, as the book_id can have gaps (due to how MySQL auto increment works)
    title: string
    author: string
    rating: number
    dateCompleted: string
    genres: number[]
}

export interface UnformattedDataRow {
  book_id: number
  title: string
  author: string
  rating: number
  genre_id: number
  dateCompleted: string
}

interface BookKey {
    title: string
    author: string
}

// Used only for incoming data
interface GenreRow {
  genre_id: number
  genre_name: string
  fiction: number
  nonfiction: number
}

// Used for incoming data sent from server, which sends [User's Read Books array, Genre mapping array]
type IncomingData = [UnformattedDataRow[], GenreRow[]]

function ViewDB() {
    const [data, setData] = useState<FormattedDataRow[]>([]);
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [removeAlertVisible, setRemoveAlertVisible] = useState(false);
    const [responseOk, setResponseOk] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [bookToRemove, setBookToRemove] = useState<BookKey>({title: "", author: ""});
    const [displayGenres, setDisplayGenres] = useState(0);  // 0 = all genres, 1 = fiction genres, 2 = nonfiction genres, 3 = no genres
    const [genreMap, setGenreMap] = useState<Map<number, [string, boolean, boolean]>>(new Map());   // Maps id to [name, fic, nonfic] array
    const [currSorted, setCurrSorted] = useState<{key: string | null; asc: boolean}>({
      key: null,
      asc: false
    })

    useEffect(() => {
        fetch("http://localhost:8000/view-db", {
          method: "GET"
        })
        .then((res) => {
            if (!res.ok)
                throw new Error("Error: Response not ok");
            
            return res.json();
        })
        .then((data) => {formatData(data)})
        .catch((e) => console.error("Error fetching table:", e));
    }, []);

    // This function transforms the incoming data from the server (consisting of both the database entries and the genres table)
    // into two distinct, properly formatted data structures (genreMap and data, respectively).
    const formatData = (data : IncomingData) => {
      //console.log(data);

      // This code uses reduce to 'reduce' the array on the outside of the {} genre entries, then turns each entry in the array
      // (consisting of {number, string, bool, bool]} pairs) into a single dictionary of (number, [string, bool, bool]) pairs
      setGenreMap(data[1].reduce((acc, obj : GenreRow) => {
        const [id, name, fic, nonfic] = Object.values(obj);
        acc.set(Number(id), [name, Boolean(fic), Boolean(nonfic)]);
        return acc;
      }, new Map<number, [string, boolean, boolean]>()));

      // For each row of the table, create a map element if one doesn't exist for this bookID. Then add the genre_id to the genres of the map entry
      const tempData: FormattedDataRow[] = [];

      // MySQL AUTO INCREMENT starts at 1 by default. Doing it this way leaves a wasted space at tempData[0] that will never be used, so 
      // since the book_id doesn't matter (as long as it's unique), I subtract one to have the array start at 0.

          
      /* Note: Currently, since MySQL AUTO INCREMENT is used, if a transaction fails (i.e., the user enters something wrong), the book_id
      *  still increments. This means failed transactions advance the book_id, which can result in gaps in ID. Since the book_id is used 
      *  when initializing data, and I'd rather not show gaps in IDs to the user (I'd rather the numbers be a count that maintains book order 
      *  rather than an arbitrary ID), I created another ID, the display_id, which is initialized in this function as a simple count (the
      *  order will still be correct, because SQL queries default to ordering by recency). I could've instead not used AUTO INCREMENT, but
      *  this would require keeping track of the number of total successful transactions and maintaining a constant counter (which is 
      *  unnecessary complexity) or read the total entries from the database before adding (but this adds an unnecessary transaction
      *  and overhead, which could be significant with a large enough database)
      */ 
      let count = 1;
      data[0].reverse().map(row => {  // reverse() is used so that the entries start with the oldest (and thus, the oldest entry is #1)
        const id = row.book_id - 1;
        if (!(id in tempData)) {
          tempData[id] = {
            display_id: count,
            title: row.title,
            author: row.author,
            rating: row.rating,
            dateCompleted: row.dateCompleted,
            genres: []
          };
          count++;
        }

        // ! is TypeScript assertion that this variable cannot be null / undefined
        tempData[id]!["genres"].push(row.genre_id);
      });
      setData(tempData);

      // currSorted set so that data defaults to descending by date (rather than descending), so newer entries are conveniently placed at the top of the table
      setCurrSorted({
        key: 'dateCompleted', 
        asc: false
      });
    }

    /*
      TODO: TODO LIST
        - Resolve Add Item TODO
        - Test/fix Removing
    */

    const handleRemove = async () => {
        const response = await fetch("http://localhost:8000/remove-item", {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bookToRemove)
        });

        setResponseOk(response.ok);
        setResponseText(await response.text());
        if (!response.ok)
          console.error("Error removing entry!");
        else
          // Originally had this conditional as &&, however the way filter() works is that it removes any item where the condition returns false. 
          // So if title != remove.title && author == remove.author (meaning it shouldn't be removed, as only the author matches), the condition 
          // evaluates to (false && true), which returns false. Thus, this item would be removed. Thus, changing it to || means that the condition 
          // returns true unless both booleans are false, in which case the item is removed. A little counter-intuitive to think that || means both 
          // must be satisfied, but it makes sense (DeMorgan's Law in action!). Could have also done !(title == remove.title && author == remove.author)
          setData(data.filter(item => item.title !== bookToRemove.title || item.author !== bookToRemove.author));
        
        setRemoveModalVisible(false);   // Hide modal
        setRemoveAlertVisible(true);    // Display remove alert
    };

    // Update currSorted to whatever column is being sorted (passed to TableHeaderElement components)
    const handleSort = (sortKey: string) => {
      setCurrSorted((prev) => {
        return {
          key: sortKey,
          asc: prev.key === sortKey ? !prev.asc : true
        }
      })
      
      /*const sorted = [...data].sort((a, b) => {
        if (sortProp === "dateCompleted") {
          let aDate = parseISO(a[sortProp])
          let bDate = parseISO(b[sortProp])

          if (isBefore(aDate, bDate))
            return -sortDirection[sortProp]
          else if (isAfter(aDate, bDate)) 
            return sortDirection[sortProp]
          else
            return 0
        }
        else if (sortProp === "rating") {
          // Always push N/A to the bottom of the sort
          if (a[sortProp] === 0)
            return 1
          else if (b[sortProp] === 0)
            return -1

          if (a[sortProp] < b[sortProp])
            return -sortDirection[sortProp]
          else if (a[sortProp] > b[sortProp])
            return sortDirection[sortProp]
          else
            return 0
        }
        else {
          let aLower = a[sortProp]?.toString().toLowerCase();
          let bLower = b[sortProp]?.toString().toLowerCase();

          // Always push N/A to the bottom of the sort
          if (aLower === "")
            return 1
          else if (bLower === "")
            return -1

          if (aLower < bLower)
            return -sortDirection[sortProp]
          else if (aLower > bLower)
            return sortDirection[sortProp]
          else
            return 0
        }
      });

      setSortDirection({
        ...sortDirection,
        [sortProp]: -sortDirection[sortProp]
    });

      for(let i = 0; i < data.length; i++) {
        console.log(data[i]);
      }
      setData(sorted);
      console.log("------------");
      for(let i = 0; i < data.length; i++) {
        console.log(data[i]);
      }*/
    }

    // Actually change `data` after a change in currSorted
    const sortData = useEffect(() => {
      if (!currSorted.key) return;

      const sortedData = [...data].sort((a, b) => {
        if (currSorted.key === "dateCompleted") {
          let aDate = parseISO(a.dateCompleted)
          let bDate = parseISO(b.dateCompleted)

          if (isBefore(aDate, bDate))
            return currSorted.asc ? -1 : 1;
          else if (isAfter(aDate, bDate)) 
            return currSorted.asc ? 1 : -1;
          else
            return 0
        }
        else if (currSorted.key === "rating") {
          // Always push N/A to the bottom of the sort
          if (a.rating === 0)
            return 1
          else if (b.rating === 0)
            return -1

          if (a.rating < b.rating)
            return currSorted.asc ? 1 : -1;
          else if (a.rating > b.rating)
            return currSorted.asc ? -1 : 1;
          else
            return 0
        }
        else if (currSorted.key === "title" || currSorted.key === "author") {
          let aLower = a[currSorted.key].toString().toLowerCase();
          let bLower = b[currSorted.key].toString().toLowerCase();

          // Always push N/A to the bottom of the sort
          if (aLower === "")
            return 1
          else if (bLower === "")
            return -1

          if (aLower < bLower)
            return currSorted.asc ? -1 : 1;
          else if (aLower > bLower)
            return currSorted.asc ? 1 : -1;
          else
            return 0
        }
        // If sorting by genre. In this case, if a's genres array contains the genre_id but b's doesn't, then we want to return 
        // negative to indicate that a comes before b (and vice versa if b's contains but a's doesn't). If both contain
        // genre_id, then return 0, indicating that both elements are equal in terms of sorting
        else {
          // Rather than trying to backwards convert the key (a string, e.g., "Fiction") into its ID, I will instead convert
          // the genre_ids to strings and compare (this saves time, as we don't have to search the entire genreMap)
          let aGenres = a.genres.map(genre_id => {
            return genreMap.get(genre_id)?.[0];
          });
          let bGenres = b.genres.map(genre_id => {
            return genreMap.get(genre_id)?.[0];
          });

          // If the key is in both a and b, return 0 (equal)
          if (aGenres.includes(currSorted.key!) && bGenres.includes(currSorted.key!)) {// Asserting key as not null because we check at the top of the function
            return 0;
          }
          // If key only in a, return -1 (push a to top, b bottom)
          else if (aGenres.includes(currSorted.key!)) {
            return  currSorted.asc ? 1 : -1;
          }
          // If key only in b, return 1 (push b to top, a bottom)
          else if (bGenres.includes(currSorted.key!)) {
            return currSorted.asc ? -1 : 1;
          }
          // If key in neither, return 0 (equal)
          else {
            return 0;
          }
        }
      });
      setData(sortedData);
    }, [currSorted]);

    return(
        <>
            {removeAlertVisible && (
              <Alert alertType={`alert ${responseOk ? "alert-primary" : "alert-danger"}`} strongtext={responseText} onClose={() => setRemoveAlertVisible(false)}>{!responseOk && "Please try again."}</Alert>
            )}
            <div className="container mt-5">
                <table className="table table-bordered table-hover">  {/* TODO: Maybe turn into component ? Try to abstract some stuff away if possible*/}
                    <thead>
                        <tr>
                            <th scope="col" className="text-center"><span className="align-middle">#</span></th>
                            {/* Map the hardcoded default elements to TableHeaderElements*/}
                            {[
                              ["Title", "title"], 
                              ["Author", "author"],
                              ["Rating", "rating"],
                              ["Date Completed", "dateCompleted"]]
                              .map(([displayName, formattedDataRowKey]) => {
                              return <TableHeaderElement 
                                handleSort={handleSort} 
                                sortDir={currSorted.key === formattedDataRowKey ? currSorted.asc : null} 
                                colKey={(formattedDataRowKey)}>
                                  {displayName}
                              </TableHeaderElement>
                            })}

                            {/* Map the (dynamic) genre elements to TableHeaderElements */}
                            {genreMap && Array.from(genreMap.values())
                            .map(([name, fic, nonfic]) => {
                              /* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/
                              if ( (displayGenres === 0) || (fic && displayGenres === 1) || (nonfic && displayGenres === 2) )
                                return <TableHeaderElement handleSort={handleSort} sortDir={currSorted.key === name ? currSorted.asc : null} colKey={name}>{name}</TableHeaderElement>;
                              else
                                return;
                            })}
                        </tr>
                    </thead>
                    <tbody className="align-middle">
                        {/* Reverse the map so that newer entries are at the top (since they are ordered by dateCompleted). Slice it first to create shallow copy, and use length-1-index instead to preserve book_id */}
                        {data.map((row) => (
                            // For special cases, if row is ever somehow nonexistent / undefined
                            row ? ( 
                              <tr key={row.display_id}>
                                <th scope="row">{row.display_id}</th>
                                <td>{row.title}</td>
                                <td>{row.author}</td>
                                <td>{row.rating || "N/A"}</td>
                                <td>{row.dateCompleted ? format(row.dateCompleted, 'MMMM dd, yyyy hh:mm a') : "N/A"}</td>
                                {genreMap && [...genreMap.entries()].map(([id, entryArr]) => {
                                  const [name, fic, nonfic] = entryArr.values();

                                  {/* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/}
                                  if ( (displayGenres === 0) || (fic && displayGenres === 1) || (nonfic && displayGenres === 2) )
                                  {
                                    if (row.genres.includes(id))
                                      return <td className="text-center h2" style={{color:'green'}}>✓</td>;
                                    else
                                      return <td className="text-center h4">❌</td>;
                                  }
                                  else
                                    return;
                                })}
                                <td className="text-center"><button type="button" className="btn btn-close" aria-label="Close" 
                                onClick={() => {
                                    setBookToRemove({title: row.title, author: row.author});
                                    setRemoveModalVisible(true);
                                }} /></td>
                              </tr>
                            ) : null
                        ))}
                    </tbody>
                </table>
                <br />
                <Radio id="no-genres" handleChange={() => setDisplayGenres(0)} checked={displayGenres === 0}>Show All Genres</Radio>
                <Radio id="all-genres" handleChange={() => setDisplayGenres(3)} checked={displayGenres === 3}>Show No Genres</Radio>
                <Radio id="fiction-genres" handleChange={() => setDisplayGenres(1)} checked={displayGenres === 1}>Show Only Fiction Genres</Radio>
                <Radio id="nonfiction-genres" handleChange={() => setDisplayGenres(2)} checked={displayGenres === 2}>Show Only Non-Fiction Genres</Radio>
                <br /><br />
                <h5>Entries are currently defaultly sorted by recency, with most recent entries at the top. Use the arrow buttons to sort by any of the categories!</h5>
                <br />
                <h5>For now, to update an entry, you must remove it and re-add it.</h5>
            </div>
            {removeModalVisible && 
              <Modal
                modal="remove" 
                modalTitle="Remove Entry" 
                modalBody={<>Are you sure you want to remove <i>{bookToRemove.title}</i> by <i>{bookToRemove.author}</i>? This cannot be undone.</>}
                yesButton="Remove"
                noButton="Cancel"
                onYes={handleRemove}
                onNo={() => setRemoveModalVisible(false)}
              />
            }
        </>
    );
};

export default ViewDB;