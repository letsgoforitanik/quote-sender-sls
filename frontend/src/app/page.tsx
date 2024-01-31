"use client";

import React from "react";

export default function Home() {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [quote, setQuote] = React.useState(null);

    async function getRandomQuote() {
        const url = `https://g8p1e2btr1.execute-api.ap-south-1.amazonaws.com/quotes`;
        const response = await fetch(url);
        const { quotes } = await response.json();
        const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomQuoteIndex]);
    }

    async function handleClick() {
        if (!email || !name) {
            alert("Fill all values");
            return;
        }

        const url = `https://g8p1e2btr1.execute-api.ap-south-1.amazonaws.com/users/subscribe`;

        const params = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
        };

        await fetch(url, params);

        alert("You are subscribed. Congrats !!");
    }

    React.useEffect(() => getRandomQuote() && undefined, []);

    return (
        <div className="container">
            {quote ? (
                <div className="quote">
                    Quote -
                    <i>
                        "{quote?.quote} by <b>{quote?.author}</b>"
                    </i>
                </div>
            ) : null}
            <div className="block">
                <span>Name</span>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="block">
                <span>Email</span>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button onClick={handleClick}>Subscribe</button>
        </div>
    );
}
