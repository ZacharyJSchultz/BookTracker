import Alert from "./Alert";
import { useState } from "react";
import Button from "./Button";

function AddItem() {
    const [alertVisible, setAlertVisible] = useState(false)
    return (
        <>
            {alertVisible && <Alert strongtext="Form submitted" onClose={() => setAlertVisible(false)}>
                Click 'Add Item' again to add another item!</Alert>}
            <Button onClick={() => setAlertVisible(true)}>Submit Form!</Button>
        </>
    );
};

export default AddItem;