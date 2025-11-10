import React, { Dispatch, SetStateAction } from "react";

import Alert from "../../components/Generic/Alert";
import Checkbox from "../../components/Generic/Checkbox";
import { FormData } from "../../types/DataTypes";
import { AddItemDataHandler } from "./AddItemDataHandler";

export class AddItemElementGenerator {
    addItemDataHandler = new AddItemDataHandler();

    displayAlert(
        alertVisible: boolean,
        responseCode: number,
        setResponseCode: Dispatch<SetStateAction<number>>,
        responseText: string,
        setResponseText: Dispatch<SetStateAction<string>>,
        setAlertVisible: Dispatch<SetStateAction<boolean>>
    ) {
        return (
            alertVisible && (
                <Alert
                    alertType={
                        responseText.includes("Error") ||
                        responseCode < 0 ||
                        responseCode >= 500
                            ? "alert-danger"
                            : "alert-primary"
                    }
                    strongtext={responseText}
                    onClose={() => {
                        setAlertVisible(false);
                        setResponseText("");
                        setResponseCode(-1);
                    }}
                >
                    {this.getResponse(responseCode)}
                </Alert>
            )
        );
    }

    displayCheckboxes(
        fiction: boolean,
        setFiction: Dispatch<SetStateAction<boolean>>,
        nonFiction: boolean,
        setNonFiction: Dispatch<SetStateAction<boolean>>,
        formData: FormData,
        setFormData: Dispatch<SetStateAction<FormData>>
    ) {
        return (
            <div className="checkbox-group">
                {fiction && (
                    <>
                        <Checkbox
                            id="ActionAdventure"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Action / Adventure
                        </Checkbox>
                        <Checkbox
                            id="Comedy"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Comedy
                        </Checkbox>
                        <Checkbox
                            id="CrimeMystery"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Crime / Mystery
                        </Checkbox>
                        <Checkbox
                            id="Fantasy"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Fantasy
                        </Checkbox>
                        <Checkbox
                            id="Romance"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Romance
                        </Checkbox>
                        <Checkbox
                            id="ScienceFiction"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Science Fiction
                        </Checkbox>
                        <Checkbox
                            id="HistoricalFiction"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Historical Fiction
                        </Checkbox>
                        <Checkbox
                            id="SuspenseThriller"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Suspense / Thriller
                        </Checkbox>
                        <Checkbox
                            id="Drama"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Drama
                        </Checkbox>
                        <Checkbox
                            id="Horror"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Horror
                        </Checkbox>
                        <Checkbox
                            id="Poetry"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Poetry
                        </Checkbox>
                        <Checkbox
                            id="GraphicNovel"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Graphic Novel
                        </Checkbox>
                        <Checkbox
                            id="YoungAdult"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Young Adult
                        </Checkbox>
                        <Checkbox
                            id="ChildrensBook"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Children's Book
                        </Checkbox>
                        <Checkbox
                            id="Comic"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Comic
                        </Checkbox>
                        <Checkbox
                            id="Other"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Other
                        </Checkbox>
                    </>
                )}
                {nonFiction && (
                    <>
                        <Checkbox
                            id="Comedy"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Comedy
                        </Checkbox>
                        <Checkbox
                            id="Horror"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Horror
                        </Checkbox>
                        <Checkbox
                            id="Poetry"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Poetry
                        </Checkbox>
                        <Checkbox
                            id="ChildrensBook"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Children's Book
                        </Checkbox>
                        <Checkbox
                            id="MemoirAutobiography"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Memoir / Autobiography
                        </Checkbox>
                        <Checkbox
                            id="Biography"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Biography
                        </Checkbox>
                        <Checkbox
                            id="FoodDrink"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Food & Drink
                        </Checkbox>
                        <Checkbox
                            id="ArtPhotography"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Art / Photography
                        </Checkbox>
                        <Checkbox
                            id="SelfHelp"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Self Help
                        </Checkbox>
                        <Checkbox
                            id="History"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            History
                        </Checkbox>
                        <Checkbox
                            id="Travel"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Travel
                        </Checkbox>
                        <Checkbox
                            id="TrueCrime"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            True Crime
                        </Checkbox>
                        <Checkbox
                            id="ScienceTechnology"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Science / Technology
                        </Checkbox>
                        <Checkbox
                            id="HumanitiesSocialSciences"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Humanities / Social Sciences
                        </Checkbox>
                        <Checkbox
                            id="Essay"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Essay
                        </Checkbox>
                        <Checkbox
                            id="Guide"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Guide
                        </Checkbox>
                        <Checkbox
                            id="ReligionSpirituality"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Religion / Spirituality
                        </Checkbox>
                        <Checkbox
                            id="Other"
                            handleChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                                this.addItemDataHandler.handleFormChange(
                                    e,
                                    setNonFiction,
                                    setFiction,
                                    formData,
                                    setFormData
                                )
                            }
                        >
                            Other
                        </Checkbox>
                    </>
                )}
            </div>
        );
    }

    getResponse(responseCode: number) {
        let resp = "";
        if (responseCode === 501) {
            resp =
                "It appears that you've already read this book. If you assigned it any new genres, they have been updated in the database. If you'd like to re-add this book to your log or re-rate it, please remove the previous entry and then try again.";
        } else if (responseCode < 0) {
            resp = "Failed to reach the server! Please try again later.";
        } else if (responseCode < 500) {
            resp =
                "Click 'Add Books' or the 'X' on the right to add another item!";
        } else {
            resp =
                "Double-check your spelling and verify that this book isn't already in the database! To try again, click 'Add Books' or the 'X' on the right!";
        }

        return resp;
    }
}
