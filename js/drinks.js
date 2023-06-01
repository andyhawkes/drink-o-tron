const combinations = countUnique(textComponents.methods[dataset]) * countUnique(textComponents.modifiers[dataset]) * countUnique(textComponents.ingredients[dataset]) * countUnique(textComponents.products[dataset]);

let indices = {
    "methods": 0,
    "modifiers": 0,
    "ingredients": 0,
    "products": 0
}
let drinkComponents = {}
let zeitgeistRecipe = "Lager and lime"

function randomiseRecipeComponents() {
    for (const component in datasets[dataset]) {
        let index = Math.floor((Math.random() * textComponents[component][datasets[dataset][component]].length))
        drinkComponents[component] = {
            "index": index,
            "value": textComponents[component][datasets[dataset][component]][index]
        }
        indices[component] = index;
    }
}

function restoreRecipeComponentsFromIndices() {
    for (const component in datasets[dataset]) {
        drinkComponents[component] = {
            "index": indices[component],
            "value": textComponents[component][datasets[dataset][component]][indices[component]]
        }
    }
}

function outputMenuIdea(newItem) {
    if (newItem === true) {
        randomiseRecipeComponents();
        updateHistory();
    }

    let method = drinkComponents.methods.value//.toLowerCase();
    let modifier = drinkComponents.modifiers.value//.toLowerCase();
    let ingredient = drinkComponents.ingredients.value.toLowerCase();
    let product = drinkComponents.products.value.toLowerCase();

    zeitgeistRecipe = method + " " + modifier + " " + ingredient + " " + product;
    zeitgeistRecipe = capitalizeFirstLetter(zeitgeistRecipe.trim());
    
    let textElement = document.getElementById('zeitgeistText');
    textElement.innerHTML = zeitgeistRecipe;

    updatePageTitle(zeitgeistRecipe);
    updateTwitterLink(twitterMessageText[dataset], zeitgeistRecipe);
}

function updateIndicesFromQSParams(){
    let QSparams = Object.fromEntries(new URLSearchParams(location.search));
    indices.methods = QSparams.a && QSparams.a < textComponents.methods[dataset].length ? QSparams.a : 0;
    indices.modifiers = QSparams.b && QSparams.b < textComponents.modifiers[dataset].length ? QSparams.b : 0;
    indices.ingredients = QSparams.c && QSparams.c < textComponents.ingredients[dataset].length ? QSparams.c : 1;
    indices.products = QSparams.d && QSparams.d < textComponents.products[dataset].length ? QSparams.d : 0;
}

function validateIndices() {
    // If all indexes are 0 then re-create them randomly
    if (indices.methods == 0 && indices.modifiers == 0 && indices.ingredients == 1 && indices.products == 0) {
        randomiseRecipeComponents();
        updateHistory(true);
    } else {
        restoreRecipeComponentsFromIndices();
    }
}

function updateComboText() {
    let comboTextElement = document.getElementById('combinations');
    comboTextElement.innerHTML = combinations.toLocaleString();
}

function init(){
    updateComboText();
    updateIndicesFromQSParams();
    validateIndices();
    outputMenuIdea(false);
}

window.addEventListener('popstate', (event) => {
    indices.methods = event.state.methodsIndex;
    indices.modifiers = event.state.modifiersIndex;
    indices.ingredients = event.state.ingredientsIndex;
    indices.products = event.state.productsIndex;
    restoreRecipeComponentsFromIndices();
    outputMenuIdea(false);
});

init();