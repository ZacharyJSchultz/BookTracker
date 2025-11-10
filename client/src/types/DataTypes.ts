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
export type UnformattedGenreRow = {
    genre_id: number;
    genre_name: string;
    fiction: number;
    nonfiction: number;
};

// Used for incoming data sent from server, which sends [User's Read Books array, Genre mapping array]
export type IncomingData = [UnformattedDataRow[], UnformattedGenreRow[]];

export type GenreMap = Map<number, [string, boolean, boolean]>;

export type SortInfo = { key: string | null; asc: boolean };

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
