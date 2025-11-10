import { isAfter, isBefore, parseISO } from "date-fns";

import {
    FormattedDataRow,
    GenreMap,
    SortInfo,
    UnformattedDataRow,
    UnformattedGenreRow
} from "../../types/DataTypes";

export class ViewDBDataHandler {
    // Reduces GenreRow[] ( {number, string, bool, bool}[] ) into a single dictionary of (number, [string, bool, bool]) pairs
    convertGenreArrayToMap(genres: UnformattedGenreRow[]) {
        return genres.reduce((acc, obj: UnformattedGenreRow) => {
            const [id, name, fic, nonfic] = Object.values(obj);
            acc.set(Number(id), [String(name), Boolean(fic), Boolean(nonfic)]);
            return acc;
        }, new Map<number, [string, boolean, boolean]>());
    }

    formatDataRows(unformattedData: UnformattedDataRow[]): FormattedDataRow[] {
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
    }

    sortData(
        data: FormattedDataRow[],
        genreMap: GenreMap,
        currSorted: SortInfo
    ) {
        return [...data].sort((a, b) => {
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
    }
}
