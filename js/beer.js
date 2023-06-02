let indices = {
    "methods": 0,
    "modifiers": 0,
    "ingredients": 0,
    "products": 0,
    "hops": 0,
}
let drinkComponents = {}
let zeitgeistRecipe = "Lager and lime"
let maxHops = 5;

const combinations = countUnique(textComponents.methods[dataset]) * countUnique(textComponents.modifiers[dataset]) * countUnique(textComponents.ingredients[dataset]) * countUnique(textComponents.products[dataset]) * (maxHops * countUnique(textComponents.hops[dataset]));

function getRandomRecipeComponents(component, count = 1) {
    let randomComponents = [];
    for (let step = 0; step < count; step++) {
        let index = Math.floor((Math.random() * textComponents[component][datasets[dataset][component]].length))
        randomComponents[step] = index;
    }
    return randomComponents;
}
function parseMultipleItems(component, index){
    let componentNames = []
    for (let i = 0; i < index.length; i++) {
        if (textComponents[component][datasets[dataset][component]][index[i]] !== ''){
            //Exclude empty ingredient strings
            componentNames.push(textComponents[component][datasets[dataset][component]][index[i]]);
        }
    }

    let rawText = "";
    switch (index.length){
        case 0:
            rawText = '';
            break;
        case 1:
            rawText = componentNames[0];
            break;
        default:
            // rawText = `${capitalizeFirstLetter(component)}: ${componentNames.join(', ')}`;
            rawText = componentNames.slice(0, componentNames.length - 1).join(', '); 
            rawText += ' &amp; ' + componentNames[componentNames.length - 1];
    }

    drinkComponents[component] = {
        "index": index,
        "value": rawText
    }
}

function randomiseRecipeComponents() {
    let randomHopCount = Math.ceil(Math.random() * maxHops);
    for (const component in datasets[dataset]) {
        if(component === "hops") {
            let hops = getRandomRecipeComponents('hops', randomHopCount);
            parseMultipleItems(component,hops);
            indices[component] = hops;
        } else {
            let index = getRandomRecipeComponents(component);
            drinkComponents[component] = {
                "index": index,
                "value": textComponents[component][datasets[dataset][component]][index]
            }
            indices[component] = index;
        }
    }
}

function restoreRecipeComponentsFromIndices() {
    for (const component in datasets[dataset]) {
        if(component === "hops") {
            parseMultipleItems(component, indices[component].split(','));
        } else {
            drinkComponents[component] = {
                "index": indices[component],
                "value": textComponents[component][datasets[dataset][component]][indices[component]]
            }
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
    let hops = ` <span class="hops">${drinkComponents.hops.value}</span>`;

    let zeitgeistRecipeCompact = `${method} ${modifier} ${ingredient} ${product}`
    zeitgeistRecipe = zeitgeistRecipeCompact + hops;
    zeitgeistRecipe = capitalizeFirstLetter(zeitgeistRecipe.trim());
    zeitgeistRecipeCompact = capitalizeFirstLetter(zeitgeistRecipeCompact.trim());
    
    let textElement = document.getElementById('zeitgeistText');
    textElement.innerHTML = zeitgeistRecipe;

    updatePageTitle(zeitgeistRecipeCompact);
    updateTwitterLink(twitterMessageText[dataset], zeitgeistRecipeCompact);
}

function updateIndicesFromQSParams(){
    let QSparams = Object.fromEntries(new URLSearchParams(location.search));
    indices.methods = QSparams.a && QSparams.a < textComponents.methods[dataset].length ? QSparams.a : 0;
    indices.modifiers = QSparams.b && QSparams.b < textComponents.modifiers[dataset].length ? QSparams.b : 0;
    indices.ingredients = QSparams.c && QSparams.c < textComponents.ingredients[dataset].length ? QSparams.c : 1;
    indices.products = QSparams.d && QSparams.d < textComponents.products[dataset].length ? QSparams.d : 0;
    indices.hops = QSparams.e ? QSparams.e : 0;
}

function validateIndices() {
    // If all indexes are 0 then re-create them randomly
    if (indices.methods == 0 && indices.modifiers == 0 && indices.ingredients == 1 && indices.products == 0 && indices.hops == 0) {
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
    indices.hops = event.state.hopsIndex;
    restoreRecipeComponentsFromIndices();
    outputMenuIdea(false);
});

init();