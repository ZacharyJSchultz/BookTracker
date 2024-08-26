import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface DataRow {
    title: string
    author: string
    rating: number
    genres: string
    dateCompleted: string
}

function ViewDB() {
    const [data, setData] = useState<DataRow[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/view-db")
        .then((res) => {
            if (!res.ok)
                throw new Error("Error: Response not ok")
            
            return res.json()
        })
        .then((data) => setData(data))
        .catch((e) => console.error("Error fetching table:", e))
    }, [])

    return(
        <div className="container mt-5">
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Author(s)</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Genre(s)</th>
                        <th scope="col">Date Completed</th>
                        <th scope="col">Time Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={(row.title, row.author)}>
                            <th scope="row">{index+1}</th>
                            <td>{row.title}</td>
                            <td>{row.author}</td>
                            <td>{row.rating || "N/A"}</td>
                            <td>{row.genres || "N/A"}</td>
                            <td>{row.dateCompleted ? format(row.dateCompleted, 'MMMM dd, yyyy') : "N/A"}</td>
                            <td>{row.dateCompleted ? format(row.dateCompleted, 'hh:mm a') : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            <h5>Entries are currently sorted by recency, with most recent entries at the top.</h5>
            <br></br>
            <h5>To update an entry, you must remove it and re-add it.</h5>
        </div>
    );
};

export default ViewDB;