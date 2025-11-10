import { ReactElement, ReactNode } from "react";

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
