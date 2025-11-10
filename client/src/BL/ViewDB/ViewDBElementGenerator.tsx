import { format } from "date-fns";
import React, { Dispatch, SetStateAction } from "react";

import Radio from "../../components/Generic/Radio";
import TableHeaderElement from "../../components/Generic/TableHeaderElement";
import {
    BookKey,
    FormattedDataRow,
    GenreMap,
    SortInfo
} from "../../types/DataTypes";

export class ViewDBElementGenerator {
    defaultHeaders = [
        ["Title", "title"],
        ["Author", "author"],
        ["Rating", "rating"],
        ["Date Completed", "dateCompleted"]
    ];

    mapDataToRows(
        data: FormattedDataRow[],
        setBookToRemove: Dispatch<SetStateAction<BookKey>>,
        setRemoveModalVisible: Dispatch<SetStateAction<boolean>>,
        genreMap: GenreMap,
        displayGenres: number
    ) {
        return data.map((row) =>
            // For special cases, if row is ever somehow nonexistent / undefined
            row ? (
                <tr key={row.displayID}>
                    <th className="" scope="row">
                        {row.displayID}
                    </th>
                    <td className="balance-text cell-width">
                        <div className="invisible-wrap-length">
                            {this.getWrapLengthPadding(row.title)}
                        </div>
                        {row.title}
                    </td>
                    <td className="balance-text cell-width">
                        <div className="invisible-wrap-length">
                            {this.getWrapLengthPadding(row.author)}
                        </div>
                        {row.author}
                    </td>
                    <td>{row.rating || "N/A"}</td>
                    <td>
                        {row.dateCompleted
                            ? format(row.dateCompleted, "MMMM dd, yyyy hh:mm a")
                            : "N/A"}
                    </td>
                    {this.fillGenreCells(row, genreMap, displayGenres)}
                    <td>
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
    }

    createRadios(
        displayGenres: number,
        setDisplayGenres: Dispatch<SetStateAction<number>>
    ) {
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
    }

    fillGenreCells(
        row: FormattedDataRow,
        genreMap: GenreMap,
        displayGenres: number
    ) {
        if (!genreMap || displayGenres === 3) return;

        return displayGenres !== 4 ? (
            // For 0 (all), 1 (fic), or 2 (nonfic), map checkmark or x to each genre call
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
                            <td className="checkmark h2" key={elementID}>
                                ✓
                            </td>
                        );
                    } else {
                        return (
                            <td className="h4" key={elementID}>
                                ❌
                            </td>
                        );
                    }
                } else return null;
            })
        ) : (
            // For 4 (one genre col), insert list of strings into the single genre col
            <td className="balance-text" key={"genres-" + row.displayID}>
                <div className="invisible-wrap-length">
                    {this.getGenreWrapLengthPadding(row, genreMap)}
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
    }

    mapGenreElementsToTableHeaderElements(
        genreMap: GenreMap,
        displayGenres: number,
        currSorted: SortInfo,
        handleSort: (sortKey: string) => void
    ) {
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
    }

    mapDefaultHeadersToTableHeaderElements(
        handleSort: (sortKey: string) => void,
        currSorted: SortInfo
    ) {
        return this.defaultHeaders.map(([displayName, formattedDataRowKey]) => {
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
                    maxWidth="18em"
                >
                    {displayName}
                </TableHeaderElement>
            );
        });
    }

    // Table width is set to fit-content, but that causes wrap to compress as much as possible. To fix this, calculate wrap padding by inserting an invisible element of a calculated length
    getWrapLengthPadding(textToPad: string): string {
        return "m".repeat(
            Math.floor(Math.max(Math.min(textToPad.length / 3, 20), 10))
        );
    }

    getGenreWrapLengthPadding(
        row: FormattedDataRow,
        genreMap: GenreMap
    ): string {
        let count = 0;
        for (const genreID of row.genres) {
            count += genreMap.get(Number(genreID))?.[0].length ?? 0;
        }

        return "m".repeat(Math.floor(Math.max(count / 4.5, 5)));
    }
}
