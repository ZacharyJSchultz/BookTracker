import { Dispatch, SetStateAction } from "react";

import { FormData } from "../../types/DataTypes";

export class AddItemDataHandler {
    // Can't handle this in handleSubmit because that is an async function, so formData could be reset before being sent
    handleFormChange(
        e: React.ChangeEvent<HTMLInputElement>,
        setNonFiction: Dispatch<SetStateAction<boolean>>,
        setFiction: Dispatch<SetStateAction<boolean>>,
        formData: FormData,
        setFormData: Dispatch<SetStateAction<FormData>>
    ) {
        const { id, value, checked } = e.target;

        if (id === "Fiction") {
            setNonFiction(false);
            setFiction(checked);

            // Reset all genre fields on switch btwn fiction / nonfiction
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
    }
}
