import { useState } from "react";

function App() {

    const [message, setMessage] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const analyzeMessage = async () => {

        if (!message.trim()) {
            setError("Please enter a customer message.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {

            const response = await fetch(
                "http://localhost:5000/api/triage",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message.trim()
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Something went wrong."
                );
            }


            setResult(data.result);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to connect to the backend."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div>

            <h1>FrontlineIQ</h1>

            <p>
                AI Customer Support Triage
            </p>


            <textarea
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
                placeholder="Enter customer message..."
                rows="6"
                cols="60"
            />


            <br />
            <br />


            <button
                onClick={analyzeMessage}
                disabled={loading}
            >

                {loading
                    ? "Analyzing..."
                    : "Analyze Message"
                }

            </button>


            {error && (

                <p>
                    ❌ {error}
                </p>

            )}


            {result && (

                <div>

                    <h2>AI Decision</h2>

                    <p>
                        <strong>Category:</strong>{" "}
                        {result.category}
                    </p>

                    <p>
                        <strong>Priority:</strong>{" "}
                        {result.priority}
                    </p>

                    <p>
                        <strong>Summary:</strong>{" "}
                        {result.summary}
                    </p>

                    <p>
                        <strong>Suggested Action:</strong>{" "}
                        {result.suggested_action}
                    </p>

                    <p>
                        <strong>Needs Human:</strong>{" "}
                        {result.needs_human
                            ? "YES"
                            : "NO"
                        }
                    </p>

                    <p>
                        <strong>Confidence:</strong>{" "}
                        {(
                            result.confidence * 100
                        ).toFixed(0)}%
                    </p>

                    {result.latency_ms !== undefined && (

                        <p>
                            <strong>Latency:</strong>{" "}
                            {result.latency_ms} ms
                        </p>

                    )}

                </div>

            )}

        </div>

    );
}

export default App;