import Alert from "./Alert";
import { FormEvent, useState } from "react";
import Button from "./Button";
import React from 'react';
import '../App.css'

type FormData = {
    title: string;
    author: string;
    rating: number;
    genre: string;
};

function AddItem() {
    const [alertVisible, setAlertVisible] = useState(false);
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        title: "",
        author: "",
        rating: 0,
        genre: ""
    })

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        setValidated(true);     // Rerenders the page, whether form is valid or not

        if (!form.checkValidity()) {
            event.stopPropagation();
            return;             // Return if form is invalid
        }

        setFormData({
            title: (form.elements.namedItem('bookTitle') as HTMLInputElement).value,
            author: (form.elements.namedItem('bookAuthor') as HTMLInputElement).value,
            rating: parseInt((form.elements.namedItem('bookGenre') as HTMLInputElement).value) || 0,
            genre: (form.elements.namedItem('bookRating') as HTMLInputElement).value
        });

        // Send form data async
        try {
            const response = await fetch('http://localhost:8000/submit-form', {
                method: 'POST',
                headers: {"Content-Type": "application/json",},
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
                setAlertVisible(true);
            }
            else {
                console.error("Error! Form submission failed! Status:", response.status);
            }
        } catch (e) {
            console.error("Error submitting form:", e);
        }
    };

    return (
        <>
            {alertVisible && <Alert strongtext="Form submitted" onClose={() => setAlertVisible(false)}>
                Click the 'X' to add another item!</Alert>}
            
            {!alertVisible &&
                <div className="container mt-5">
                    <h2 className="mb-4">Submit a Book:</h2>

                    {/* Form Start */}
                    <form 
                        onSubmit={handleSubmit}
                        className={`needs-validation ${validated ? "was-validated" : ""}`}
                        noValidate
                    >

                        {/* Title */}
                        <div className="mb-4 form-group">
                            <label htmlFor="bookTitle" className="form-label"><b>*</b> Book Title:</label>
                            <input type="text" className="form-control" id="bookTitle" placeholder="e.g., And Then There Were None" required></input>
                            <div className="invalid-feedback" style={{color: "red"}}>Please fill out this field.</div>
                        </div>

                        {/* Author */}
                        <div className="mb-4 form-group">
                            <label htmlFor="bookAuthor" className="form-label"><b>*</b> Author(s):</label>
                            <input type="text" className="form-control" id="bookAuthor" placeholder="e.g., Agatha Christie" required></input>
                            <div className="invalid-feedback" style={{color: "red"}}>Please fill out this field.</div>
                        </div>

                        {/* Rating */}
                        <div className="row mb-3 g-3 align-items-center form-group">
                            <div className="col-auto">
                                <label htmlFor="bookRating" className="form-label">Rating:</label>
                            </div>
                            <div className="col-auto">
                                <input type="number" min="0" max="10" className="form-control" id="bookRating" placeholder=""></input>
                            </div>
                            <div className="col-auto">
                                <span id="passwordHelpInline" className="form-text">Optional, number from 1-10</span>
                            </div>
                        </div>

                        {/* Genre */}
                        <div className="mb-4 form-group">
                            <label htmlFor="bookGenre" className="form-label">Genre(s):</label>
                            <input type="text" className="form-control" id="bookGenre" placeholder="e.g., Action/Adventure, Mystery, Nonfiction, Fantasy, etc."></input>
                            <span id="passwordHelpInline" className="form-text">Optional, can list one or many genres</span>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary" /*onClick={() => setAlertVisible(true)}*/>Submit Form!</button>
                    </form>
                </div>
            }
        </>
    );
};

export default AddItem;