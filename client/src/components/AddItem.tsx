import Alert from "./Alert";
import { FormEvent, useState } from "react";
import React from 'react';

type FormData = {
    title: string;
    author: string;
    rating: number;
    genre: string;
};

function AddItem({ alertVisible, setAlertVisible } : { alertVisible: boolean, setAlertVisible: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [failedValidation, setFailedValidation] = useState(false);    // If form validation fails, set this variable (which will display validation errors, only upon failure)
    const [formData, setFormData] = useState<FormData>({                // State variable for Form Data, set after every change to the form.
        title: "",
        author: "",
        rating: 0,
        genre: ""
    });
    const [response, setResponse] = useState("");   // Used to store response from server after submitting form (displayed in alert as strongtext)

    // Handle changes in form to update SetFormData (can't handle in handleSubmit because that is an async function, so formData could be reset before being sent)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ID = the html ID of the value changed. Value = new value in that field. Basically, only update the field in the state variable that was modified
        const { id, value } = e.target;

        // Use ... (spread) operator to create shallow copy of formData to restore in formData
        setFormData({
            ...formData,
            [id]: value
        });
    }

    // Handle submitting of form to send to server and display alert
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.stopPropagation();
            setFailedValidation(true);      // Rerenders the page, displaying the validation errors if form is invalid
            return;                         // Return if form is invalid
        }

        // Send form data asynchronously
        try {
            setFailedValidation(false);     // Set form to valid, so no validation stuff shows up on screen

            const response = await fetch("http://localhost:8000/submit-form", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            // Handle successful submission
            if (response.ok) {
                console.log("Form submission successful!");
                setFormData({       // Reset form data
                    title: "",
                    author: "",
                    rating: 0,
                    genre: ""
                });
            }
            else {
                console.error("Error! Form submission failed! Status:", response.status);
            }

            // Check server's response, and set that response to the state variable (to be used in the alert)
            const res = await response.text()

            setResponse(res)
            setAlertVisible(true);
        } catch (e) {
            console.error("Error submitting form:", e);
        }
    };

    return (
        <>
            {/* Display alert if alertVisible true (if form submitted). On close, hide alert and reset response */}
            {alertVisible && 
                <Alert alertType={response.includes("Error") ? "alert-danger" : "alert-primary"} strongtext={response} onClose={() => {setAlertVisible(false); setResponse("")}}>
                    {
                        response.includes("Error") ? 
                        "Double-check your spelling and verify that this book isn't already in the database! To try again, click 'Add Books' or the 'X' on the right!" : 
                        "Click 'Add Books' or the 'X' on the right to add another item!"
                    }
                </Alert>}
            
            {/* Display alert if alertVisible false (if form not submitted) */}
            {!alertVisible &&
                <div className="container mt-5">
                    <h2 className="mb-4">Submit a Book:</h2>

                    {/* Form Start */}
                    <form 
                        onSubmit={handleSubmit}
                        className={`needs-validation ${failedValidation ? "was-validated" : ""}`}
                        noValidate
                    >

                        {/* Title */}
                        <div className="mb-4 form-group">
                            <label htmlFor="title" className="form-label"><b>*</b> Book Title:</label>
                            <input type="text" className="form-control" id="title" placeholder="e.g., And Then There Were None" onChange={handleChange} required></input>
                            <div className="invalid-feedback" style={{color: "red"}}>Please fill out this field.</div>
                        </div>

                        {/* Author */}
                        <div className="mb-4 form-group">
                            <label htmlFor="author" className="form-label"><b>*</b> Author(s):</label>
                            <input type="text" className="form-control" id="author" placeholder="e.g., Agatha Christie" onChange={handleChange} required></input>
                            <div className="invalid-feedback" style={{color: "red"}}>Please fill out this field.</div>
                        </div>

                        {/* Rating */}
                        <div className="row mb-3 g-3 align-items-center form-group">
                            <div className="col-auto">
                                <label htmlFor="rating" className="form-label">Rating:</label>
                            </div>
                            <div className="col-auto">
                                <input type="number" min="1" max="10" className="form-control" id="rating" onChange={handleChange} placeholder=""></input>
                            </div>
                            <div className="col-auto">
                                <span id="passwordHelpInline" className="form-text">Optional, number from 1-10</span>
                            </div>
                        </div>

                        {/* Genre */}
                        <div className="mb-4 form-group">
                            <label htmlFor="genre" className="form-label">Genre(s):</label>
                            <input type="text" className="form-control" id="genre" onChange={handleChange} placeholder="e.g., Action/Adventure, Mystery, Nonfiction, Fantasy, etc."></input>
                            <span id="passwordHelpInline" className="form-text">Optional, can list one or many genres</span>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary">Submit Form!</button>
                    </form>
                </div>
            }
        </>
    );
};

export default AddItem;