import { ReactElement, ReactNode } from "react";

// Props

export type NavBarProps = {
    setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AlertProps = {
    alertType?: string;
    strongtext?: string;
    children?: ReactNode;
    onClose: () => void;
};

export type CheckboxProps = {
    id: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children: ReactNode;
};

export type ModalProps = {
    modal: string;
    modalTitle?: string;
    modalBody?: ReactElement;
    yesButton: string;
    yesButtonClasses?: string;
    noButtonClasses?: string;
    noButton: string;
    onYes: () => void;
    onNo: () => void;
};

export type RadioProps = {
    id: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked: boolean;
    children: ReactNode;
};

export type TableHeaderElementProps = {
    handleSort?: (sortKey: string) => void;
    sortDir?: boolean | null;
    colKey: string;
    showSortButton?: boolean;
    minWidth?: string;
    maxWidth?: string;
    centerText?: boolean;
    children?: ReactNode;
};

// Data Types

/** Note: Since MySQL AUTO INCREMENT is used, if a transaction fails, the book_id still increments, which can result in gaps in ID. I'd rather
 *  not show gaps in IDs to the user (the numbers should be a count that maintains book order rather than an arbitrary ID), I created another ID,
 *  the display_id, which is initialized in this function as a simple count. I could've instead not used AUTO INCREMENT, but this would require
 *  keeping track of the number of total successful transactions and maintaining a constant counter (which is unnecessary complexity) or read the
 *  total entries from the database before adding (but this adds an unnecessary transaction and overhead, which could be significant with a large enough database)
 */

export type FormattedDataRow = {
    displayID: number; // This is different from the book_id, as the book_id can have gaps (due to how MySQL auto increment works)
    title: string;
    author: string;
    rating: number;
    dateCompleted: string;
    genres: number[];
};

export type UnformattedDataRow = {
    book_id: number;
    title: string;
    author: string;
    rating: number;
    genre_id: number;
    date_completed: string;
};

export type BookKey = {
    title: string;
    author: string;
};

// Used only for incoming data
export type GenreRow = {
    genre_id: number;
    genre_name: string;
    fiction: number;
    nonfiction: number;
};

// Used for incoming data sent from server, which sends [User's Read Books array, Genre mapping array]
export type IncomingData = [UnformattedDataRow[], GenreRow[]];

export type GenreMap = Map<number, [string, boolean, boolean]>;

export type SortInfo = { key: string | null; asc: boolean };

// TODO: Get this from server!
export type FormData = {
    title: string;
    author: string;
    rating: number;
    Fiction?: boolean;
    NonFiction?: boolean;
    ActionAdventure?: boolean;
    Comedy?: boolean;
    CrimeMystery?: boolean;
    Fantasy?: boolean;
    Romance?: boolean;
    ScienceFiction?: boolean;
    HistoricalFiction?: boolean;
    SuspenseThriller?: boolean;
    Drama?: boolean;
    Horror?: boolean;
    Poetry?: boolean;
    GraphicNovel?: boolean;
    YoungAdult?: boolean;
    ChildrensBook?: boolean;
    Comic?: boolean;
    MemoirAutobiography?: boolean;
    Biography?: boolean;
    FoodDrink?: boolean;
    ArtPhotography?: boolean;
    SelfHelp?: boolean;
    History?: boolean;
    Travel?: boolean;
    TrueCrime?: boolean;
    ScienceTechnology?: boolean;
    HumanitiesSocialSciences?: boolean;
    Essay?: boolean;
    Guide?: boolean;
    ReligionSpirituality?: boolean;
    Other?: boolean;
};
