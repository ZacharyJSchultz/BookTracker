import React, { useState, useEffect } from 'react'
import { format, parseISO, isBefore, isAfter } from 'date-fns'
import Modal from './Modal'
import Alert from './Alert'

interface DataRow {
    title: string
    author: string
    rating: number
    genres: string
    dateCompleted: string
}

interface SortDir {
  title: number
  author: number
  rating: number
  genres: number
  dateCompleted: number
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

    // Determines whether the sort direction will sort ascending (Z-A) or descending (A-Z). 1 = descending, -1 = ascending
    const [sortDirection, setSortDirection] = useState<SortDir>({
      title: 1,
      author: 1,
      rating: 1,
      genres: 1,
      dateCompleted: 1
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
        .then((data) => setData(data))
        .catch((e) => console.error("Error fetching table:", e))
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

    const handleSort = (sortProp: keyof DataRow) => {
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
          let aLower = a[sortProp].toString().toLowerCase();
          let bLower = b[sortProp].toString().toLowerCase();

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
      }
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
                            <th scope="col" className="text-center">
                              <span className="align-middle">Title</span>
                              <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort("title")}>
                                <b>{sortDirection.title === 1 ? "↓" : "↑"}</b>
                              </button>
                            </th>
                            <th scope="col" className="text-center">
                              <span className="align-middle">Author(s)</span>
                              <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort("author")}>
                                <b>{sortDirection.author === 1 ? "↓" : "↑"}</b>
                              </button>
                            </th>
                            <th scope="col" className="text-center">
                              <span className="align-middle">Rating</span>
                              <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort("rating")}>
                                <b>{sortDirection.rating === 1 ? "↓" : "↑"}</b>
                              </button>
                            </th>
                            <th scope="col" className="text-center">
                              <span className="align-middle">Genre(s)</span>
                              <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort("genres")}>
                                <b>{sortDirection.genres === 1 ? "↓" : "↑"}</b>
                              </button>
                            </th>
                            <th scope="col" className="text-center">
                              <span className="align-middle">Date Completed</span>
                              <button type="button" className="btn btn-sm btn-secondary float-end" aria-label="Sort" onClick={() => handleSort("dateCompleted")}>
                                <b>{sortDirection.dateCompleted === 1 ? "↓" : "↑"}</b>
                              </button>
                            </th>
                            <th scope="col" className="text-center"></th>
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
                                <td>{row.genres || "N/A"}</td>
                                <td>{row.dateCompleted ? format(row.dateCompleted, 'MMMM dd, yyyy hh:mm a') : "N/A"}</td>
                                <td className="text-center"><button type="button" className="btn btn-close" aria-label="Close" 
                                onClick={() => {
                                    setBookToRemove({title: row.title, author: row.author});
                                    setRemoveModalVisible(true);
                                }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br></br>
                <h5>Entries are currently defaultly sorted by recency, with most recent entries at the top. Use the arrow buttons to sort by any of the categories.</h5>
                <br></br>
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
