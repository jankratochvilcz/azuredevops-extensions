const enums = (state = {
    cardDecks: [
        {
            key: "fibonacci",
            name: "Fibonacci sequence",
            about: "The available values are 0, 1, 2, 3, 5, 8, 13, 21. The fibonacci sequence is great at reflecting the inherent uncertainty when estimating larger items.",
            cardValues: [
                {
                    title: "🆓",
                    value: 0
                },
                {
                    title: "1",
                    value: 1
                },
                {
                    title: "2",
                    value: 2
                },
                {
                    title: "3",
                    value: 3
                },
                {
                    title: "5",
                    value: 5
                },
                {
                    title: "8",
                    value: 8
                },
                {
                    title: "13",
                    value: 13
                },
                {
                    title: "21",
                    value: 21
                },
                {
                    title: "😵",
                    value: NaN
                },
                {
                    title: "🍵",
                    value: NaN
                }
            ]
        }
    ]
}, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default enums;
