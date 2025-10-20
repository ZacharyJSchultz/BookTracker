import "../App.scss";

import { format, isAfter, isBefore, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";

import {
    BookKey,
    FormattedDataRow,
    GenreMap,
    GenreRow,
    IncomingData,
    SortInfo,
    UnformattedDataRow
} from "../types";
import Alert from "./Generic/Alert";
import Modal from "./Generic/Modal";
import Radio from "./Generic/Radio";
import TableHeaderElement from "./Generic/TableHeaderElement";

function ViewDB() {
    const [data, setData] = useState<FormattedDataRow[]>([]);
    const [errorAlertVisible, setErrorAlertVisible] = useState(false);
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [removeAlertVisible, setRemoveAlertVisible] = useState(false);
    const [responseOk, setResponseOk] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [bookToRemove, setBookToRemove] = useState<BookKey>({
        title: "",
        author: ""
    });
    const [displayGenres, setDisplayGenres] = useState(4); // 0 = all genres, 1 = fiction genres, 2 = nonfiction genres, 3 = no genres, 4 = single col genres list
    const [genreMap, setGenreMap] = useState<GenreMap>(new Map()); // id => [name, fic, nonfic]
    const [currSorted, setCurrSorted] = useState<SortInfo>({
        key: "dateCompleted",
        asc: false
    });
    const defaultHeaders = [
        ["Title", "title"],
        ["Author", "author"],
        ["Rating", "rating"],
        ["Date Completed", "dateCompleted"]
    ];

    useEffect(() => {
        fetch("http://localhost:8000/view-db", {
            method: "GET"
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error: Response not ok");

                return res.json();
            })
            .then((data) => {
                initializeData(data);
                setErrorAlertVisible(false);
            })
            .catch((e) => {
                console.error("Error fetching table:", e);
                setErrorAlertVisible(true);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Transforms incoming data from the server (user data and genres list) into two distinct objects (data and genreMap, respectively).
    const initializeData = (data: IncomingData) => {
        setGenreMap(convertGenreArrayToMap(data[1]));

        // reverse() so entries start with the oldest
        const formattedData: FormattedDataRow[] = formatDataRows(
            data[0].reverse()
        );
        setData(formattedData);

        // // currSorted set so that data defaults to descending by date (rather than ascending), so newer entries are conveniently placed at the top of the table
        // setCurrSorted({
        //     key: "dateCompleted",
        //     asc: false,
        // });
    };

    /*
      TODO: TODO LIST
        - Get sorting working! Test/fix
        - Set up genres types based on server response if possible...?
        - Go thru and fix / remove comments
        - Organize functions better across large files (viewdb, additem)
        - Double check README
    */

    const handleRemove = async () => {
        try {
            const response = await fetch("http://localhost:8000/remove-item", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookToRemove)
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

            setRemoveModalVisible(false);
            setRemoveAlertVisible(true);
        } catch (err) {
            console.error("Error removing entry:", err);
        }
    };

    // Reduces GenreRow[] ( {number, string, bool, bool}[] ) into a single dictionary of (number, [string, bool, bool]) pairs
    const convertGenreArrayToMap = (genres: GenreRow[]) => {
        return genres.reduce((acc, obj: GenreRow) => {
            const [id, name, fic, nonfic] = Object.values(obj);
            acc.set(Number(id), [String(name), Boolean(fic), Boolean(nonfic)]);
            return acc;
        }, new Map<number, [string, boolean, boolean]>());
    };

    const formatDataRows = (
        unformattedData: UnformattedDataRow[]
    ): FormattedDataRow[] => {
        const formattedData: FormattedDataRow[] = [];
        let count = 1;

        unformattedData.forEach((row) => {
            const id = row.book_id - 1; // MySQL AUTO INCREMENT starts at 1 by default, so subtract one to have the array start at 0.
            if (!(id in formattedData)) {
                formattedData[id] = {
                    displayID: count,
                    title: row.title,
                    author: row.author,
                    rating: row.rating,
                    dateCompleted: row.date_completed,
                    genres: []
                };
                count++;
            }

            row.genre_id && formattedData[id]!.genres.push(row.genre_id);
        });

        return formattedData;
    };

    const handleSort = (sortKey: string) => {
        setCurrSorted((prev) => {
            return {
                key: sortKey,
                asc: prev.key === sortKey ? !prev.asc : true
            };
        });

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
    };

    const sortData = useEffect(() => {
        if (!currSorted.key) return;

        const sortedData = [...data].sort((a, b) => {
            if (currSorted.key === "dateCompleted") {
                let aDate = parseISO(a.dateCompleted);
                let bDate = parseISO(b.dateCompleted);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currSorted]);

    const mapGenreElementsToTableHeaderElements = () => {
        if (!genreMap || displayGenres === 3) return null;

        return displayGenres === 4 ? (
            <TableHeaderElement
                colKey="genres"
                minWidth="4.6875em"
                maxWidth="15.625em"
                showSortButton={false}
            >
                Genres
            </TableHeaderElement>
        ) : (
            Array.from(genreMap.values()).map(([name, fic, nonfic]) => {
                /* displayGenres = 0 is all, 1 is fiction, 2 is nonfiction, 3 is none, 4 is one genres col*/
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
                                currSorted.key === name ? currSorted.asc : null
                            }
                            colKey={name}
                            minWidth="4.6875em"
                            maxWidth="15.625em"
                        >
                            {name}
                        </TableHeaderElement>
                    );
                else {
                    return null;
                }
            })
        );
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
                    minWidth="4.6875em"
                    maxWidth="15.625em"
                >
                    {displayName}
                </TableHeaderElement>
            );
        });
    };

    const fillGenreCells = (row: FormattedDataRow) => {
        if (!genreMap || displayGenres === 3) return;

        return displayGenres !== 4 ? (
            // For 0 (all), 1 (fic), or 2 (nonfic), map check or x to each genre call
            [...genreMap].map(([id, entryArr]) => {
                const [name, fic, nonfic] = entryArr.values();
                const elementID = String(id).concat("-icon");
                if (
                    displayGenres === 0 ||
                    (fic && displayGenres === 1) ||
                    (nonfic && displayGenres === 2)
                ) {
                    if (row.genres.includes(id)) {
                        return (
                            <td
                                className="checkmark text-center h2"
                                key={elementID}
                            >
                                ✓
                            </td>
                        );
                    } else {
                        return (
                            <td className="text-center h4" key={elementID}>
                                ❌
                            </td>
                        );
                    }
                } else return null;
            })
        ) : (
            // For 4 (one genre col), insert list of strings into the single genre col
            <td
                className="text-center balance-text"
                key={"genres-" + row.displayID}
            >
                <div className="invisible-wrap-length">
                    {getWrapLengthPadding(row)}
                </div>
                {[...genreMap]
                    .reduce((acc, value) => {
                        return row.genres.includes(value[0])
                            ? acc + value[1][0] + ", "
                            : acc;
                    }, "")
                    // Slice extra comma and space at end
                    .slice(0, -2)}
            </td>
        );
    };

    /**
     * For the single genres col, wrap is set to balance. Table width is set to min-content (fit-content causes padding issue),
     * but that causes wrap to compress as much as possible. To fix this, calculate wrap padding by inserting an invisible
     * element of a calculated length
     */
    const getWrapLengthPadding = (row: FormattedDataRow): string => {
        let count = 0;
        for (const genreID in row.genres) {
            count += genreMap.get(Number(genreID))?.[0].length ?? 0;
        }

        return "m".repeat(Math.floor(Math.min(count / 4, 30)));
    };

    const mapDataToRows = () => {
        return data.map((row) =>
            // For special cases, if row is ever somehow nonexistent / undefined
            row ? (
                <tr key={row.displayID}>
                    <th className="text-center" scope="row">
                        {row.displayID}
                    </th>
                    <td>{row.title}</td>
                    <td>{row.author}</td>
                    <td>{row.rating || "N/A"}</td>
                    <td>
                        {row.dateCompleted
                            ? format(row.dateCompleted, "MMMM dd, yyyy hh:mm a")
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
                                    author: row.author
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
                    id="single-col-genres"
                    handleChange={() => setDisplayGenres(4)}
                    checked={displayGenres === 4}
                >
                    Show Genres in Single Column
                </Radio>
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
            {errorAlertVisible && (
                <Alert
                    alertType="alert-danger"
                    strongtext="Error: Failed to connect to server or database"
                    onClose={() => {
                        setErrorAlertVisible(false);
                    }}
                >
                    Please reload the page and double check the server and
                    container are both running!
                </Alert>
            )}
            <div className="container generic-top-padding">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr key="header">
                            <TableHeaderElement
                                colKey="count"
                                showSortButton={false}
                                centerText={true}
                            >
                                #
                            </TableHeaderElement>
                            {mapDefaultHeadersToTableHeaderElements()}
                            {mapGenreElementsToTableHeaderElements()}
                            <TableHeaderElement
                                colKey="remove"
                                showSortButton={false}
                            />
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
                    yesButtonClasses="btn-danger"
                    noButtonClasses="btn-primary"
                    onYes={handleRemove}
                    onNo={() => setRemoveModalVisible(false)}
                />
            )}
        </>
    );
}

export default ViewDB;
