import { FormEvent, useState } from "react";
import React from "react";

import { AddItemDataHandler } from "../BL/AddItem/AddItemDataHandler";
import { AddItemElementGenerator } from "../BL/AddItem/AddItemElementGenerator";
import { FormData } from "../types/DataTypes";
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

    const addItemDataHandler = new AddItemDataHandler();
    const addItemElementGenerator = new AddItemElementGenerator();

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
            const resCode = response.status;

            setResponseText(resText);
            setResponseCode(resCode);
            setFiction(false);
            setNonFiction(false);
            setAlertVisible(true);
        } catch (e) {
            console.error("Error submitting form:", e);
            setResponseCode(-1);
            setResponseText("Error");
            setAlertVisible(true);
        }
    };

    return (
        <>
            {addItemElementGenerator.displayAlert(
                alertVisible,
                responseCode,
                setResponseCode,
                responseText,
                setResponseText,
                setAlertVisible
            )}
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
                                onChange={(e) =>
                                    addItemDataHandler.handleFormChange(
                                        e,
                                        setNonFiction,
                                        setFiction,
                                        formData,
                                        setFormData
                                    )
                                }
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
                                onChange={(e) =>
                                    addItemDataHandler.handleFormChange(
                                        e,
                                        setNonFiction,
                                        setFiction,
                                        formData,
                                        setFormData
                                    )
                                }
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
                                    onChange={(e) =>
                                        addItemDataHandler.handleFormChange(
                                            e,
                                            setNonFiction,
                                            setFiction,
                                            formData,
                                            setFormData
                                        )
                                    }
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
                                handleChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    addItemDataHandler.handleFormChange(
                                        e,
                                        setNonFiction,
                                        setFiction,
                                        formData,
                                        setFormData
                                    )
                                }
                                checked={fiction}
                            >
                                Fiction
                            </Radio>
                            <Radio
                                id="NonFiction"
                                handleChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    addItemDataHandler.handleFormChange(
                                        e,
                                        setNonFiction,
                                        setFiction,
                                        formData,
                                        setFormData
                                    )
                                }
                                checked={nonFiction}
                            >
                                Non-Fiction
                            </Radio>
                            <p />
                            {addItemElementGenerator.displayCheckboxes(
                                fiction,
                                setFiction,
                                nonFiction,
                                setNonFiction,
                                formData,
                                setFormData
                            )}
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
