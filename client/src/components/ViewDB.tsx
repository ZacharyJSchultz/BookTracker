import React, { useState, useEffect } from 'react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import Modal from './Modal';
import Alert from './Alert';
import TableElement from './TableElement';
import Radio from './Radio';

/*export interface FormattedDataRow {
    title: string
    author: string
    rating: number
    dateCompleted: string
    Fiction: boolean;
    NonFiction: boolean;
    ActionAdventure: boolean;
    Comedy: boolean;
    CrimeMystery: boolean;
    Fantasy: boolean;
    Romance: boolean;
    ScienceFiction: boolean;
    HistoricalFiction: boolean;
    SuspenseThriller: boolean;
    Drama: boolean;
    Horror: boolean;
    Poetry: boolean;
    GraphicNovel: boolean;
    YoungAdult: boolean;
    ChildrensBook: boolean;
    Comic: boolean;
    MemoirAutobiography: boolean;
    Biography: boolean;
    FoodDrink: boolean;
    ArtPhotography: boolean;
    SelfHelp: boolean;
    History: boolean;
    Travel: boolean;
    TrueCrime: boolean;
    ScienceTechnology: boolean;
    HumanitiesSocialSciences: boolean;
    Essay: boolean;
    Guide: boolean;
    ReligionSpirituality: boolean;
    Other: boolean;
}*/

export interface FormattedDataRow {
    title: string
    author: string
    rating: number
    dateCompleted: string
    genres: number[]
}

export type FormattedDataRowKey = keyof FormattedDataRow;

export interface UnformattedDataRow {
  book_id: number
  title: string
  author: string
  rating: number
  genre_id: number
  dateCompleted: string
}

interface SortDir {
  title: number
  author: number
  rating: number
  dateCompleted: number
  Fiction: number;
  NonFiction: number;
  ActionAdventure: number;
  Comedy: number;
  CrimeMystery: number;
  Fantasy: number;
  Romance: number;
  ScienceFiction: number;
  HistoricalFiction: number;
  SuspenseThriller: number;
  Drama: number;
  Horror: number;
  Poetry: number;
  GraphicNovel: number;
  YoungAdult: number;
  ChildrensBook: number;
  Comic: number;
  MemoirAutobiography: number;
  Biography: number;
  FoodDrink: number;
  ArtPhotography: number;
  SelfHelp: number;
  History: number;
  Travel: number;
  TrueCrime: number;
  ScienceTechnology: number;
  HumanitiesSocialSciences: number;
  Essay: number;
  Guide: number;
  ReligionSpirituality: number;
  Other: number;
}

interface BookKey {
    title: string
    author: string
}

interface GenreRow {
  genre_id: number
  genre_name: string
  fiction: number
  nonfiction: number
}

// Used for incoming data sent from server, which sends [User's Read Books array, Genre mapping array]
type IncomingData = [UnformattedDataRow[], GenreRow[]]

function ViewDB() {
    const [unformatted, setUnformattedData] = useState<UnformattedDataRow[]>([]);
    const [data, setData] = useState<FormattedDataRow[]>([]);
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [removeAlertVisible, setRemoveAlertVisible] = useState(false);
    const [responseOk, setResponseOk] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [bookToRemove, setBookToRemove] = useState<BookKey>({title: "", author: ""});
    const [displayGenres, setDisplayGenres] = useState(0);  // 0 = all genres, 1 = fiction genres, 2 = nonfiction genres, 3 = no genres
    const [genreMap, setGenreMap] = useState<Map<number, [string, boolean, boolean]>>(new Map());

    // Determines whether the sort direction will sort ascending (Z-A) or descending (A-Z). 1 = descending, -1 = ascending
    const [sortDirection, setSortDirection] = useState<SortDir>({
      title: 1,
      author: 1,
      rating: 1,
      dateCompleted: 1,
      Fiction: 1,
      NonFiction: 1,
      ActionAdventure: 1,
      Comedy: 1,
      CrimeMystery: 1,
      Fantasy: 1,
      Romance: 1,
      ScienceFiction: 1,
      HistoricalFiction: 1,
      SuspenseThriller: 1,
      Drama: 1,
      Horror: 1,
      Poetry: 1,
      GraphicNovel: 1,
      YoungAdult: 1,
      ChildrensBook: 1,
      Comic: 1,
      MemoirAutobiography: 1,
      Biography: 1,
      FoodDrink: 1,
      ArtPhotography: 1,
      SelfHelp: 1,
      History: 1,
      Travel: 1,
      TrueCrime: 1,
      ScienceTechnology: 1,
      HumanitiesSocialSciences: 1,
      Essay: 1,
      Guide: 1,
      ReligionSpirituality: 1,
      Other: 1,
    });

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

    const formatData = (data : IncomingData) => {
      //console.log(data);

      // This code used reduce to 'reduce' the array on the outside of the {} entries, then turns each entry in the array (consisting of
      // {number: string} pairs) into a single dictionary of (number, string) pairs
      setGenreMap(data[1].reduce((acc, obj : GenreRow) => {
        const [id, name, fic, nonfic] = Object.values(obj);
        acc.set(Number(id), [name, Boolean(fic), Boolean(nonfic)]);
        return acc;
      }, new Map<number, [string, boolean, boolean]>()));

      // For each row of the table, create a map element if one doesn't exist for this bookID. Then add the genre_id to the genres of the map entry
      const tempData: FormattedDataRow[] = [];

      data[0].map(row => {
        const id = row.book_id;
        if (!(id in tempData)) {
          tempData[id] = {
            title: row.title,
            author: row.author,
            rating: row.rating,
            dateCompleted: row.dateCompleted,
            genres: []
          };
        }

        // ! is TypeScript assertion that this variable cannot be null / undefined
        tempData[id]!["genres"].push(row.genre_id);
      }, new Map<number, FormattedDataRow>());

      setData(tempData);
    }

    /*
      TODO: TODO LIST
        - Get sorting working
        - Test/fix Removing
        - See if I can get the cols with the genres smaller (and change the Yes/No to a green check/red x)
        - Fix bug (TODO down below)
    */

    const handleRemove = async () => {
        const response = await fetch("http://localhost:8000/remove-item", {
          method: "DELETE",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(bookToRemove)
        });

        setResponseOk(response.ok);
        setResponseText(await response.text());
        if (!response.ok) {
          console.log("Error removing entry!");
        }
        // Originally had this conditional as &&, however the way filter() works is that it removes any item where the condition returns false. 
        // So if title != remove.title && author == remove.author (meaning it shouldn't be removed, as only the author matches), the condition 
        // evaluates to (false && true), which returns false. Thus, this item would be removed. Thus, changing it to || means that the condition 
        // returns true unless both booleans are false, in which case the item is removed. A little counter-intuitive to think that || means both 
        // must be satisfied, but it makes sense (DeMorgan's Law in action!).
        setData(data.filter(item => item.title !== bookToRemove.title || item.author !== bookToRemove.author));

        setRemoveModalVisible(false);
        setRemoveAlertVisible(true);
    };

    const handleSort = (sortProp: FormattedDataRowKey) => {
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

      /*for(let i = 0; i < data.length; i++) {
        console.log(data[i]);
      }*/
      //setData(sorted); TODO UNCOMMENT
      /*console.log("------------");
      for(let i = 0; i < data.length; i++) {
        console.log(data[i]);
      }*/
    };
    
    return(
        <>
            {removeAlertVisible && (
              <Alert alertType={`alert ${responseOk ? "alert-primary" : "alert-danger"}`} strongtext={responseText} onClose={() => setRemoveAlertVisible(false)}>{!responseOk && "Please try again."}</Alert>
            )}
            <div className="container mt-5">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center"><span className="align-middle">#</span></th>
                            {/* Map the hardcoded default elements to TableElements */}
                            {([
                              ["Title", true, true], 
                              ["Author", true, true], 
                              ["Rating", true, true], 
                              ["Date Completed", true, true]
                            ]).map(([name, fic, nonfic]) => {
                              return <TableElement handleSort={handleSort} sortDir={1} key={(name as FormattedDataRowKey)}>{name}</TableElement>
                            })}

                            {/* Map the (dynamic) genre elements to TableElements */}
                            {genreMap && Array.from(genreMap.values())
                            .map(([name, fic, nonfic]) => {
                              const typedKey = name as FormattedDataRowKey;

                              /* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/
                              if ( (displayGenres === 0) || (fic && displayGenres === 1) || (nonfic && displayGenres === 2) )
                                return <TableElement handleSort={handleSort} sortDir={1} key={typedKey}>{typedKey}</TableElement>;
                              else
                                return;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Reverse the map so that newer entries are at the top (since they are ordered by dateCompleted). Slice it first to create shallow copy, and use length-1-index instead to preserve book_id */}
                        {data.slice().reverse().map((row, index) => (
                            <tr key={index}>
                                <th scope="row">{data.length - 1 - index}</th>
                                <td>{row.title}</td>
                                <td>{row.author}</td>
                                <td>{row.rating || "N/A"}</td>
                                <td>{row.dateCompleted ? format(row.dateCompleted, 'MMMM dd, yyyy hh:mm a') : "N/A"}</td>
                                {genreMap && [...genreMap.entries()].map(([id, entryArr]) => {
                                  const [name, fic, nonfic] = entryArr.values();
                                  const typedKey = name as FormattedDataRowKey;

                                  console.log(id, "|", name);
                                  console.log("genres:", row.genres.map((r) => genreMap.get(r)?.[0]));

                                  {/* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/}
                                  if ( (displayGenres === 0) || (fic && displayGenres === 1) || (nonfic && displayGenres === 2) )
                                  {
                                    if (row.genres.includes(id))  // TODO: ERROR WHEN ADDING 2 BOOKS IN A ROW: FICTION AUTO SELECTED ON RADIO, BUT IT DOESN'T GET SENT TO DB!
                                      return <td>Yes</td>;
                                    else
                                      return <td>No</td>;
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
                <h5>To update an entry, you must remove it and re-add it.</h5>
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