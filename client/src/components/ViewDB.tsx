import React, { useState, useEffect } from 'react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import Modal from './Modal';
import Alert from './Alert';
import TableElement from './TableElement';
import Radio from './Radio';

export interface DataRow {
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
}

export type DataRowKey = keyof DataRow;

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

function ViewDB() {
    const [data, setData] = useState<DataRow[]>([]);
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [removeAlertVisible, setRemoveAlertVisible] = useState(false);
    const [responseOk, setResponseOk] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [bookToRemove, setBookToRemove] = useState<BookKey>({title: "", author: ""});
    const [displayGenres, setDisplayGenres] = useState(3);  // 0 = all genres, 1 = fiction genres, 2 = nonfiction genres, 3 = no genres

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

    // Used when creating the Table Elements. The first num in str represents whether it's fiction (1), nonfiction (2), or both (0), with non-genre attributes receiving a special distinction (4)
    const tableElementNames = {
      title: "4-Title",
      author: "4-Author",
      rating: "4-Rating",
      dateCompleted: "4-Date Completed",
      Fiction: "1-Fiction",
      NonFiction: "2-Non-Fiction",
      ActionAdventure: "1-Action / Adventure",
      Comedy: "0-Comedy", 
      CrimeMystery: "1-Crime / Mystery", 
      Fantasy: "1-Fantasy", 
      Romance: "1-Romance", 
      ScienceFiction: "1-Science Fiction", 
      HistoricalFiction: "1-Historical Fiction",
      SuspenseThriller: "1-Suspense / Thriller",
      Drama: "1-Drama", 
      Horror: "1-Horror", 
      Poetry: "0-Poetry", 
      GraphicNovel: "1-Graphic Novel", 
      YoungAdult: "1-Young Adult", 
      ChildrensBook: "1-Children's Book", 
      Comic: "1-Comic", 
      MemoirAutobiography: "2-Memoir / Autobiography", 
      Biography: "2-Biography",
      FoodDrink: "2-Food & Drink", 
      ArtPhotography: "2-Art / Photography", 
      SelfHelp: "2-Self Help",
      History: "2-History", 
      Travel: "2-Travel", 
      TrueCrime: "2-True Crime", 
      ScienceTechnology: "2-Science / Technology", 
      HumanitiesSocialSciences: "2-Humanities / Social Sciences", 
      Essay: "2-Essay",
      Guide: "2-Guide",
      ReligionSpirituality: "2-Religion / Spirituality", 
      Other: "0-Other", 
    };

    useEffect(() => {
        fetch("http://localhost:8000/view-db", {
          method: "GET"
        })
        .then((res) => {
            if (!res.ok)
                throw new Error("Error: Response not ok");
            
            return res.json();
        })
        .then((data) => setData(data))
        .catch((e) => console.error("Error fetching table:", e));
    }, []);

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
        // Originally had this conditional as &&, however the way filter() works is that it removes any item where the condition returns false. So if
        // title != remove.title && author == remove.author (meaning it shouldn't be removed, as only the author matches), the condition evaluates to
        // (false && true), which returns false. Thus, this item would be removed. Thus, changing it to || means that the condition returns true unless
        // both booleans are false, in which case the item is removed. A little counter-intuitive to think that || means both must be satisfied, but it makes sense.
        setData(data.filter(item => item.title !== bookToRemove.title || item.author !== bookToRemove.author));

        setRemoveModalVisible(false);
        setRemoveAlertVisible(true);
    };

    const handleSort = (sortProp: DataRowKey) => {
      const sorted = [...data].sort((a, b) => {
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
      setData(sorted);
      /*console.log("------------");
      for(let i = 0; i < data.length; i++) {
        console.log(data[i]);
      }*/
    };

    const generateRows = (key: string) => {
      const typedKey = key as DataRowKey;
      const classifier = Number(tableElementNames[typedKey].charAt(0));

      // If classifier === 4, return TableElement (because this is nongenre). If displayGenres === 3, that means display no genres, so return.
      // If classifier & displayGenres aren't 0 (0 signifies display all genres) and doesn't equal displayGenres value, then also return (this would mean display is Fiction & classifier Non-Fiction, or vice versa)
      if(classifier !== 4 && (displayGenres === 3 || (classifier !== 0 && displayGenres !== 0 && displayGenres !== classifier)))
        return;
      else
        return (<TableElement handleSort={handleSort} sortDir={sortDirection[typedKey]} key={typedKey}>{tableElementNames[typedKey].substring(2)}</TableElement>);
    }
    
    return(
        <>
            {removeAlertVisible && (
              <Alert alertType={`alert ${responseOk ? "alert-primary" : "alert-danger"}`} strongtext={responseText} onClose={() => setRemoveAlertVisible(false)}>{!responseOk && "Please try again."}</Alert>
            )}
            {}
            <div className="container mt-5">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center"><span className="align-middle">#</span></th>
                            {Object.keys(tableElementNames).map((key) => generateRows(key))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Note: ${row.title}-${row.author} is used because (row.title, row.author) is deceptive: it's NOT a tuple; it only uses the last value */}
                        {data.map((row, index) => (
                            <tr key={(`${row.title}-${row.author}`)}>
                                <th scope="row">{index+1}</th>
                                <td>{row.title}</td>
                                <td>{row.author}</td>
                                <td>{row.rating || "N/A"}</td>
                                <td>{row.dateCompleted ? format(row.dateCompleted, 'MMMM dd, yyyy hh:mm a') : "N/A"}</td>   {/* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.Fiction}</td>}                    {/* Note: Some genres are both fiction & nonfiction*/}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.NonFiction}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.ActionAdventure}</td>}
                                {(displayGenres !== 3) && <td>{row.Comedy}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.CrimeMystery}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.Fantasy}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.Romance}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.ScienceFiction}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.HistoricalFiction}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.SuspenseThriller}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.Drama}</td>}
                                {(displayGenres === 0 || displayGenres === 1) && <td>{row.Horror}</td>}
                                {(displayGenres !== 3) && <td>{row.Poetry}</td>}
                                {(displayGenres !== 3) && <td>{row.GraphicNovel}</td>}
                                {(displayGenres !== 3) && <td>{row.YoungAdult}</td>}
                                {(displayGenres !== 3) && <td>{row.ChildrensBook}</td>}
                                {(displayGenres !== 3) && <td>{row.Comic}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.MemoirAutobiography}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.Biography}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.FoodDrink}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.ArtPhotography}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.SelfHelp}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.History}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.Travel}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.TrueCrime}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.ScienceTechnology}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.HumanitiesSocialSciences}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.Essay}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.Guide}</td>}
                                {(displayGenres === 0 || displayGenres === 2) && <td>{row.ReligionSpirituality}</td>}
                                {(displayGenres !== 3) && <td>{row.Other}</td>}
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
                <Radio id="no-genres" handleChange={() => setDisplayGenres(3)} checked={displayGenres === 3}>Show No Genres</Radio>
                <Radio id="all-genres" handleChange={() => setDisplayGenres(0)} checked={displayGenres === 0}>Show All Genres</Radio>
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
