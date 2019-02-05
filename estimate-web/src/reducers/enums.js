const enums = (state = {
    cardDecks: [
        {
            key: "fibonacci",
            name: "Fibonacci sequence",
            about: "The available values are 0, 1, 2, 3, 5, 8, 13, 21. The fibonacci sequence is great at reflecting the inherent uncertainty when estimating larger items.",
            cardValues: ["🆓", "1", "2", "3", "5", "8", "13", "21", "😵", "🍵"]
        }
    ]
}, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

export default enums;