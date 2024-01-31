interface ApiGatewayEvent {
    body: string;
}

interface Quote {
    quote: string;
    author: string;
}

interface Quotes {
    quotes: Quote[]
}