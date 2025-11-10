import React, { useEffect, useState } from "react";

import { ViewDBDataHandler } from "../BL/ViewDB/ViewDBDataHandler";
import { ViewDBElementGenerator } from "../BL/ViewDB/ViewDBElementGenerator";
import {
    BookKey,
    FormattedDataRow,
    GenreMap,
    IncomingData,
    SortInfo
} from "../types/DataTypes";
import Alert from "./Generic/Alert";
import Modal from "./Generic/Modal";
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
        // Default to sorting by date ascending
        key: "dateCompleted",
        asc: true
    });

    const dataHandler = new ViewDBDataHandler();
    const elementGenerator = new ViewDBElementGenerator();

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
        setGenreMap(dataHandler.convertGenreArrayToMap(data[1]));
        setData(dataHandler.formatDataRows(data[0]));
    };

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
                    // Remove items where both title and author equal the bookToRemove - since (title, author) pairs must be unique, this won't cause any problems
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

    const handleSort = (sortKey: string) => {
        setCurrSorted((prev) => {
            return {
                key: sortKey,
                asc: prev.key === sortKey ? !prev.asc : true
            };
        });
    };

    // Sorting useEffect that runs on change to currSorted
    useEffect(() => {
        if (!currSorted.key) return;
        setData(dataHandler.sortData(data, genreMap, currSorted));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currSorted]);

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
                            {elementGenerator.mapDefaultHeadersToTableHeaderElements(
                                handleSort,
                                currSorted
                            )}
                            {elementGenerator.mapGenreElementsToTableHeaderElements(
                                genreMap,
                                displayGenres,
                                currSorted,
                                handleSort
                            )}
                            <TableHeaderElement
                                colKey="remove"
                                showSortButton={false}
                            />
                        </tr>
                    </thead>
                    <tbody className="align-middle">
                        {elementGenerator.mapDataToRows(
                            data,
                            setBookToRemove,
                            setRemoveModalVisible,
                            genreMap,
                            displayGenres
                        )}
                    </tbody>
                </table>
                <br />
                {elementGenerator.createRadios(displayGenres, setDisplayGenres)}
                <br />
                <br />
                <h5>
                    Entries are currently defaultly sorted by recency, with most
                    recent entries at the top. Use the arrow buttons to sort by
                    any of the categories, or the options above to change how
                    genres are displayed!
                </h5>
                <br />
                <h5>To update an entry, you must remove it and re-add it.</h5>
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
