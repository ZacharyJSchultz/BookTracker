import "../App.scss";

import { format, isAfter, isBefore, parseISO } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";

import {
    BookKey,
    FormattedDataRow,
    GenreMap,
    GenreRow,
    IncomingData,
    SortInfo,
    UnformattedDataRow,
} from "../types";
import Alert from "./Generic/Alert";
import Modal from "./Generic/Modal";
import Radio from "./Generic/Radio";
import TableHeaderElement from "./Generic/TableHeaderElement";

// TODO: Idea: Add another mode/version of the table that, instead of having a col for each genre, instead lists all the genres for
// an entry in a single "genres" column (like before). This mode could be switched to with a switch

function ViewDB() {
    const [data, setData] = useState<FormattedDataRow[]>([]);
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [removeAlertVisible, setRemoveAlertVisible] = useState(false);
    const [responseOk, setResponseOk] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [bookToRemove, setBookToRemove] = useState<BookKey>({
        title: "",
        author: "",
    });
    const [displayGenres, setDisplayGenres] = useState(0); // 0 = all genres, 1 = fiction genres, 2 = nonfiction genres, 3 = no genres
    const [genreMap, setGenreMap] = useState<GenreMap>(new Map()); // id => [name, fic, nonfic]
    const [currSorted, setCurrSorted] = useState<SortInfo>({
        key: "date_completed",
        asc: false,
    });
    const defaultHeaders = [
        ["Title", "title"],
        ["Author", "author"],
        ["Rating", "rating"],
        ["Date Completed", "date_completed"],
    ];

    useEffect(() => {
        fetch("http://localhost:8000/view-db", {
            method: "GET",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error: Response not ok");

                return res.json();
            })
            .then((data) => {
                formatData(data);
            })
            .catch((e) => console.error("Error fetching table:", e));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Transforms incoming data from the server (user data and genres list) into two distinct objects (data and genreMap, respectively).
    const formatData = (data: IncomingData) => {
        setGenreMap(convertGenreArrayToMap(data[1]));

        const tempData: FormattedDataRow[] = [];

        let count = 1;
        // reverse() so entries start with the oldest
        data[0].reverse().forEach((row) => {
            initializeDataRow({ row, tempData, count });
            count++;
        });
        setData(tempData);

        // // currSorted set so that data defaults to descending by date (rather than ascending), so newer entries are conveniently placed at the top of the table
        // setCurrSorted({
        //     key: "date_completed",
        //     asc: false,
        // });
    };

    /*
      TODO: TODO LIST
        - Resolve Add Item TODO
        - Test/fix Removing (and everything)
        - Go thru and fix / remove comments
    */

    const handleRemove = async () => {
        const response = await fetch("http://localhost:8000/remove-item", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookToRemove),
        });

        setResponseOk(response.ok);
        setResponseText(await response.text());
        if (!response.ok) {
            console.error("Error removing entry!");
        } else {
            setData(
                // Remove items where both title and author equal the bookToRemove - since (title, author) pairs must be unique, this won't run into problems
                data.filter(
                    (item) =>
                        !(
                            item.title === bookToRemove.title &&
                            item.author === bookToRemove.author
                        )
                )
            );
        }

        setRemoveModalVisible(false); // Hide modal
        setRemoveAlertVisible(true); // Display remove alert
    };

    // Reduces GenreRow[] ( {number, string, bool, bool}[] ) into a single dictionary of (number, [string, bool, bool]) pairs
    const convertGenreArrayToMap = (genres: GenreRow[]) => {
        return genres.reduce((acc, obj: GenreRow) => {
            const [id, name, fic, nonfic] = Object.values(obj);
            acc.set(Number(id), [String(name), Boolean(fic), Boolean(nonfic)]);
            return acc;
        }, new Map<number, [string, boolean, boolean]>());
    };

    const initializeDataRow = (params: {
        row: UnformattedDataRow;
        tempData: FormattedDataRow[];
        count: number;
    }): void => {
        const { row, tempData, count } = params;
        const id = row.book_id - 1; // MySQL AUTO INCREMENT starts at 1 by default, so subtract one to have the array start at 0.
        if (!(id in tempData)) {
            tempData[id] = {
                display_id: count,
                title: row.title,
                author: row.author,
                rating: row.rating,
                date_completed: row.date_completed,
                genres: [],
            };
        }

        tempData[id]!.genres.push(row.genre_id);
    };

    // Update currSorted to whatever column is being sorted (callback passed to TableHeaderElement components)
    const handleSort = (sortKey: string) => {
        setCurrSorted((prev) => {
            return {
                key: sortKey,
                asc: prev.key === sortKey ? !prev.asc : true,
            };
        });

        /*const sorted = [...data].sort((a, b) => {
        if (sortProp === "date_completed") {
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
    };

    // Actually change `data` after a change in currSorted
    const sortData = useEffect(() => {
        if (!currSorted.key) return;

        const sortedData = [...data].sort((a, b) => {
            if (currSorted.key === "date_completed") {
                let aDate = parseISO(a.date_completed);
                let bDate = parseISO(b.date_completed);

                if (isBefore(aDate, bDate)) return currSorted.asc ? -1 : 1;
                else if (isAfter(aDate, bDate)) return currSorted.asc ? 1 : -1;
                else return 0;
            } else if (currSorted.key === "rating") {
                // Always push N/A to the bottom of the sort
                if (a.rating === 0) return 1;
                else if (b.rating === 0) return -1;

                if (a.rating < b.rating) return currSorted.asc ? 1 : -1;
                else if (a.rating > b.rating) return currSorted.asc ? -1 : 1;
                else return 0;
            } else if (
                currSorted.key === "title" ||
                currSorted.key === "author"
            ) {
                let aLower = a[currSorted.key].toString().toLowerCase();
                let bLower = b[currSorted.key].toString().toLowerCase();

                // Always push N/A to the bottom of the sort
                if (aLower === "") return 1;
                else if (bLower === "") return -1;

                if (aLower < bLower) return currSorted.asc ? -1 : 1;
                else if (aLower > bLower) return currSorted.asc ? 1 : -1;
                else return 0;
            } else {
                // Rather than trying to backwards convert the key (a string, e.g., "Fiction") into its ID, instead convert
                // the genre_ids to strings and compare (this saves time, as we don't have to search the entire genreMap)
                let aGenres = a.genres.map((genre_id) => {
                    return genreMap.get(genre_id)?.[0];
                });
                let bGenres = b.genres.map((genre_id) => {
                    return genreMap.get(genre_id)?.[0];
                });

                // If a's genres array contains the genre_id but b's doesn't, then we want to return negative to indicate that a comes before b
                // (and vice versa if b's contains but a's doesn't). If both contain genre_id, then return 0, indicating that both elements are equal in terms of sorting

                // If the key is in both a and b, return 0 (equal)
                if (
                    aGenres.includes(currSorted.key!) &&
                    bGenres.includes(currSorted.key!)
                ) {
                    return 0;
                }
                // If key only in a, return -1 (push a to top, b bottom)
                else if (aGenres.includes(currSorted.key!)) {
                    return currSorted.asc ? 1 : -1;
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

    const mapGenreElementsToTableHeaderElements = () => {
        return genreMap
            ? Array.from(genreMap.values()).map(([name, fic, nonfic]) => {
                  /* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/
                  if (
                      displayGenres === 0 ||
                      (fic && displayGenres === 1) ||
                      (nonfic && displayGenres === 2)
                  )
                      return (
                          <TableHeaderElement
                              key={name}
                              handleSort={handleSort}
                              sortDir={
                                  currSorted.key === name
                                      ? currSorted.asc
                                      : null
                              }
                              colKey={name}
                          >
                              {name}
                          </TableHeaderElement>
                      );
                  else {
                      return <></>;
                  }
              })
            : null;
    };

    const mapDefaultHeadersToTableHeaderElements = () => {
        return defaultHeaders.map(([displayName, formattedDataRowKey]) => {
            return (
                <TableHeaderElement
                    key={formattedDataRowKey}
                    handleSort={handleSort}
                    sortDir={
                        currSorted.key === formattedDataRowKey
                            ? currSorted.asc
                            : null
                    }
                    colKey={formattedDataRowKey}
                >
                    {displayName}
                </TableHeaderElement>
            );
        });
    };

    const fillGenreCells = (row: FormattedDataRow) => {
        return genreMap
            ? [...genreMap.entries()].map(([id, entryArr]) => {
                  const [name, fic, nonfic] = entryArr.values();

                  /* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none*/
                  if (
                      displayGenres === 0 ||
                      (fic && displayGenres === 1) ||
                      (nonfic && displayGenres === 2)
                  ) {
                      if (row.genres.includes(id))
                          return (
                              <td className="checkmark text-center h2">✓</td>
                          );
                      else return <td className="text-center h4">❌</td>;
                  } else return <></>;
              })
            : null;
    };

    const mapDataToRows = () => {
        return data.map((row) =>
            // For special cases, if row is ever somehow nonexistent / undefined
            row ? (
                <tr key={row.display_id}>
                    <th scope="row">{row.display_id}</th>
                    <td>{row.title}</td>
                    <td>{row.author}</td>
                    <td>{row.rating || "N/A"}</td>
                    <td>
                        {row.date_completed
                            ? format(
                                  row.date_completed,
                                  "MMMM dd, yyyy hh:mm a"
                              )
                            : "N/A"}
                    </td>
                    {fillGenreCells(row)}
                    <td className="text-center">
                        <button
                            type="button"
                            className="btn btn-close"
                            aria-label="Close"
                            onClick={() => {
                                setBookToRemove({
                                    title: row.title,
                                    author: row.author,
                                });
                                setRemoveModalVisible(true);
                            }}
                        />
                    </td>
                </tr>
            ) : null
        );
    };

    const createRadios = () => {
        return (
            <div className="radio-group">
                <Radio
                    id="no-genres"
                    handleChange={() => setDisplayGenres(0)}
                    checked={displayGenres === 0}
                >
                    Show All Genres
                </Radio>
                <Radio
                    id="all-genres"
                    handleChange={() => setDisplayGenres(3)}
                    checked={displayGenres === 3}
                >
                    Show No Genres
                </Radio>
                <Radio
                    id="fiction-genres"
                    handleChange={() => setDisplayGenres(1)}
                    checked={displayGenres === 1}
                >
                    Show Only Fiction Genres
                </Radio>
                <Radio
                    id="nonfiction-genres"
                    handleChange={() => setDisplayGenres(2)}
                    checked={displayGenres === 2}
                >
                    Show Only Non-Fiction Genres
                </Radio>
            </div>
        );
    };

    return (
        <>
            {removeAlertVisible && (
                <Alert
                    alertType={`alert ${
                        responseOk ? "alert-primary" : "alert-danger"
                    }`}
                    strongtext={responseText}
                    onClose={() => setRemoveAlertVisible(false)}
                >
                    {!responseOk && "Please try again."}
                </Alert>
            )}
            <div className="container mt-5">
                <table className="table table-bordered table-hover">
                    {/* TODO: Maybe turn into component ? Try to abstract some stuff away if possible*/}
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">
                                <span className="align-middle">#</span>
                            </th>
                            {/* Map the hardcoded default elements to TableHeaderElements*/}
                            {mapDefaultHeadersToTableHeaderElements()}

                            {/* Map the (dynamic) genre elements to TableHeaderElements */}
                            {mapGenreElementsToTableHeaderElements()}
                        </tr>
                    </thead>
                    <tbody className="align-middle">{mapDataToRows()}</tbody>
                </table>
                <br />
                {createRadios()}
                <br />
                <br />
                <h5>
                    Entries are currently defaultly sorted by recency, with most
                    recent entries at the top. Use the arrow buttons to sort by
                    any of the categories!
                </h5>
                <br />
                <h5>
                    For now, to update an entry, you must remove it and re-add
                    it.
                </h5>
            </div>
            {removeModalVisible && (
                <Modal
                    modal="remove"
                    modalTitle="Remove Entry"
                    modalBody={
                        <>
                            Are you sure you want to remove{" "}
                            <i>{bookToRemove.title}</i> by{" "}
                            <i>{bookToRemove.author}</i>? This cannot be undone.
                        </>
                    }
                    yesButton="Remove"
                    noButton="Cancel"
                    onYes={handleRemove}
                    onNo={() => setRemoveModalVisible(false)}
                />
            )}
        </>
    );
}

export default ViewDB;
