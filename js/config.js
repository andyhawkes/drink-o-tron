const appNames = {
    "default": "DRINK-O-TRON",
    "beer": "Craft Beer Generator | DRINK-O-TRON",
    "xmas": "Xmas beverage bot | DRINK-O-TRON",
}

const twitterBaseURL = "https://twitter.com/intent/tweet?text=";
const twitterHashtag = "#drinkotron";
const twitterUsername = "@drink_o_tron";
const twitterMessageText = {
    "default": `Loving this drink idea from ${twitterUsername} - `,
    "xmas": `Loving this Christmas drink idea from ${twitterUsername} - `,
}

const datasets = {
    "default": {
        "methods": "default",
        "modifiers": "default",
        "ingredients": "default",
        "products": "default",
    },
    "beer": {
        "methods": "beer",
        "modifiers": "beer",
        "ingredients": "beer",
        "products": "beer",
        "hops": "beer",
    },
}