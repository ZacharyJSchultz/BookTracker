import "../App.scss";

import { FormEvent, useCallback, useState } from "react";
import React from "react";

import { FormData } from "../types";
import Alert from "./Generic/Alert";
import Checkbox from "./Generic/Checkbox";
import Radio from "./Generic/Radio";

function AddItem({
    alertVisible,
    setAlertVisible
}: {
    alertVisible: boolean;
    setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [failedValidation, setFailedValidation] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        author: "",
        rating: 0
    });
    const [responseText, setResponseText] = useState("");
    const [responseCode, setResponseCode] = useState(-1);
    const [nonFiction, setNonFiction] = useState(false);
    const [fiction, setFiction] = useState(false);

    // Handle changes in form to update SetFormData (can't handle in handleSubmit because that is an async function, so formData could be reset before being sent)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, checked } = e.target;

        // ID = the html ID of the value changed. Value = new value in that field. Basically, only update the field in the state variable that was modified
        if (id === "Fiction") {
            setNonFiction(false);
            setFiction(checked);

            // Reset all genre fields and set fiction
            setFormData({
                title: formData.title,
                author: formData.author,
                rating: formData.rating,
                Fiction: checked,
                NonFiction: !checked
            });
        } else if (id === "NonFiction") {
            setFiction(false);
            setNonFiction(checked);

            setFormData({
                title: formData.title,
                author: formData.author,
                rating: formData.rating,
                Fiction: !checked,
                NonFiction: checked
            });
        } else {
            if (e.target.type === "checkbox") {
                setFormData({
                    ...formData,
                    [id]: checked // Need to use checked instead of value (because default value is always 'on' for checkboxes)
                });
            } else {
                setFormData({
                    ...formData,
                    [id]: value
                });
            }
        }
    };

    // Handle submitting of form to send to server and display alert
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.stopPropagation();
            setFailedValidation(true);
            return;
        }

        try {
            setFailedValidation(false);

            const response = await fetch("http://localhost:8000/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Form submission successful!");
                setFormData({
                    title: "",
                    author: "",
                    rating: 0
                });
            } else {
                console.error(
                    "Error! Form submission failed! Status:",
                    response.status
                );
            }

            const resText = await response.text();
            const resCode = await response.status;

            setResponseText(resText);
            setResponseCode(resCode);
            setFiction(false);
            setNonFiction(false);
            setAlertVisible(true);
        } catch (e) {
            console.error("Error submitting form:", e);
        }
    };

    const displayAlert = () => {
        // Display alert if alertVisible true (if form submitted). On close, hide alert and reset response
        return (
            alertVisible && (
                <Alert
                    alertType={
                        responseText.includes("Error")
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
                    {getResponse()}
                </Alert>
            )
        );
    };

    const getResponse = () => {
        let resp = "";
        if (responseCode === 501) {
            resp =
                "It appears that you've already read this book. If you assigned it any new genres, they have been updated in the database. If you'd like to re-add this book to your log or re-rate it, please remove the previous entry and then try again.";
        } else if (responseCode === -1) {
            resp = "Error reaching the server! Please try again later.";
        } else if (responseCode < 500) {
            resp =
                "Click 'Add Books' or the 'X' on the right to add another item!";
        } else {
            resp =
                "Double-check your spelling and verify that this book isn't already in the database! To try again, click 'Add Books' or the 'X' on the right!";
        }

        return resp;
    };

    const displayCheckboxes = () => {
        return (
            <div className="checkbox-group">
                {fiction && (
                    <>
                        <Checkbox
                            id="ActionAdventure"
                            handleChange={handleChange}
                        >
                            Action / Adventure
                        </Checkbox>
                        <Checkbox id="Comedy" handleChange={handleChange}>
                            Comedy
                        </Checkbox>
                        <Checkbox id="CrimeMystery" handleChange={handleChange}>
                            Crime / Mystery
                        </Checkbox>
                        <Checkbox id="Fantasy" handleChange={handleChange}>
                            Fantasy
                        </Checkbox>
                        <Checkbox id="Romance" handleChange={handleChange}>
                            Romance
                        </Checkbox>
                        <Checkbox
                            id="ScienceFiction"
                            handleChange={handleChange}
                        >
                            Science Fiction
                        </Checkbox>
                        <Checkbox
                            id="HistoricalFiction"
                            handleChange={handleChange}
                        >
                            Historical Fiction
                        </Checkbox>
                        <Checkbox
                            id="SuspenseThriller"
                            handleChange={handleChange}
                        >
                            Suspense / Thriller
                        </Checkbox>
                        <Checkbox id="Drama" handleChange={handleChange}>
                            Drama
                        </Checkbox>
                        <Checkbox id="Horror" handleChange={handleChange}>
                            Horror
                        </Checkbox>
                        <Checkbox id="Poetry" handleChange={handleChange}>
                            Poetry
                        </Checkbox>
                        <Checkbox id="GraphicNovel" handleChange={handleChange}>
                            Graphic Novel
                        </Checkbox>
                        <Checkbox id="YoungAdult" handleChange={handleChange}>
                            Young Adult
                        </Checkbox>
                        <Checkbox
                            id="ChildrensBook"
                            handleChange={handleChange}
                        >
                            Children's Book
                        </Checkbox>
                        <Checkbox id="Comic" handleChange={handleChange}>
                            Comic
                        </Checkbox>
                        <Checkbox id="Other" handleChange={handleChange}>
                            Other
                        </Checkbox>
                    </>
                )}
                {nonFiction && (
                    <>
                        <Checkbox id="Comedy" handleChange={handleChange}>
                            Comedy
                        </Checkbox>
                        <Checkbox id="Horror" handleChange={handleChange}>
                            Horror
                        </Checkbox>
                        <Checkbox id="Poetry" handleChange={handleChange}>
                            Poetry
                        </Checkbox>
                        <Checkbox
                            id="ChildrensBook"
                            handleChange={handleChange}
                        >
                            Children's Book
                        </Checkbox>
                        <Checkbox
                            id="MemoirAutobiography"
                            handleChange={handleChange}
                        >
                            Memoir / Autobiography
                        </Checkbox>
                        <Checkbox id="FoodDrink" handleChange={handleChange}>
                            Food & Drink
                        </Checkbox>
                        <Checkbox
                            id="ArtPhotography"
                            handleChange={handleChange}
                        >
                            Art / Photography
                        </Checkbox>
                        <Checkbox id="SelfHelp" handleChange={handleChange}>
                            Self Help
                        </Checkbox>
                        <Checkbox id="History" handleChange={handleChange}>
                            History
                        </Checkbox>
                        <Checkbox id="Travel" handleChange={handleChange}>
                            Travel
                        </Checkbox>
                        <Checkbox id="TrueCrime" handleChange={handleChange}>
                            True Crime
                        </Checkbox>
                        <Checkbox
                            id="ScienceTechnology"
                            handleChange={handleChange}
                        >
                            Science / Technology
                        </Checkbox>
                        <Checkbox
                            id="HumanitiesSocialSciences"
                            handleChange={handleChange}
                        >
                            Humanities / Social Sciences
                        </Checkbox>
                        <Checkbox id="Essay" handleChange={handleChange}>
                            Essay
                        </Checkbox>
                        <Checkbox id="Guide" handleChange={handleChange}>
                            Guide
                        </Checkbox>
                        <Checkbox
                            id="ReligionSpirituality"
                            handleChange={handleChange}
                        >
                            Religion / Spirituality
                        </Checkbox>
                        <Checkbox id="Other" handleChange={handleChange}>
                            Other
                        </Checkbox>
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            {displayAlert()}
            {!alertVisible && (
                <div className="container generic-top-padding">
                    <h2 className="mb-4">Submit a Book:</h2>

                    {/* Form Start */}
                    <form
                        onSubmit={handleSubmit}
                        className={`needs-validation ${
                            failedValidation ? "was-validated" : ""
                        }`}
                        noValidate
                    >
                        {/* Title */}
                        <div className="mb-4 form-group">
                            <label htmlFor="title" className="form-label">
                                <b>*</b> Book Title:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                placeholder="e.g., And Then There Were None"
                                onChange={handleChange}
                                required
                            ></input>
                            <div className="invalid-feedback">
                                Please fill out this field.
                            </div>
                        </div>

                        {/* Author */}
                        <div className="mb-4 form-group">
                            <label htmlFor="author" className="form-label">
                                <b>*</b> Author(s):
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="author"
                                placeholder="e.g., Agatha Christie"
                                onChange={handleChange}
                                required
                            ></input>
                            <div className="invalid-feedback">
                                Please fill out this field.
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="row mb-3 g-3 align-items-center form-group">
                            <div className="col-auto">
                                <label htmlFor="rating" className="form-label">
                                    Rating:
                                </label>
                            </div>
                            <div className="col-auto">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    className="form-control"
                                    id="rating"
                                    onChange={handleChange}
                                    placeholder=""
                                ></input>
                            </div>
                            <div className="col-auto">
                                <span
                                    id="passwordHelpInline"
                                    className="form-text"
                                >
                                    Optional, number from 1-10
                                </span>
                            </div>
                        </div>

                        {/* Genre */}
                        <div className="mb-4 form-group">
                            <p className="form-label">Genre(s):</p>
                            <Radio
                                id="Fiction"
                                handleChange={handleChange}
                                checked={fiction}
                            >
                                Fiction
                            </Radio>
                            <Radio
                                id="NonFiction"
                                handleChange={handleChange}
                                checked={nonFiction}
                            >
                                Non-Fiction
                            </Radio>
                            <p />
                            {displayCheckboxes()}
                            <p id="passwordHelpInline" className="form-text">
                                Optional, can select one, many, or no genres
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary">
                            Submit Form!
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

export default AddItem;
