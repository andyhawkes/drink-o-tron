let indices = {
    "methods": 0,
    "modifiers": 0,
    "ingredients": 0,
    "products": 0,
    "hops": 0,
}
let drinkComponents = {}
let zeitgeistRecipe = "Lager and lime"
let maxHops = (includeHops === true) ? 5 : 0;
let maxIngredients = 3;

const combinations = countUnique(textComponents.methods[dataset]) * countUnique(textComponents.modifiers[dataset]) * (maxIngredients * countUnique(textComponents.ingredients[dataset])) * countUnique(textComponents.products[dataset]) * ((maxHops > 0) ? maxHops * countUnique(textComponents.hops[dataset]) : 1);

function getRandomRecipeComponents(component, count = 1) {
    let randomComponents = [];
    for (let step = 0; step < count; step++) {
        let index = Math.floor((Math.random() * textComponents[component][datasets[dataset][component]].length))
        randomComponents[step] = index;
    }
    //deduplicate in case we get multiples of the same index
    let uniqueComponents = [...new Set(randomComponents)];
    return uniqueComponents;
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
    switch (componentNames.length){
        case 0:
            rawText = '';
            break;
        case 1:
            rawText = componentNames[0];
            break;
        default:
            // rawText = `${capitalizeFirstLetter(component)}: ${componentNames.join(', ')}`;
            rawText = `${componentNames.slice(0, componentNames.length - 1).join(', ')} & ${componentNames[componentNames.length - 1]}`;
    }

    drinkComponents[component] = {
        "index": index,
        "value": rawText
    }
}

function randomiseRecipeComponents() {
    for (const component in datasets[dataset]) {
        let selections = '1';
        switch(component){
            case "hops":
                selections = Math.ceil(Math.random() * maxHops);
                break;
            case "ingredients":
                selections = Math.ceil(Math.random() * maxIngredients);
                break;
        }
        if(selections > 1) {
            let items = getRandomRecipeComponents(component, selections);
            parseMultipleItems(component,items);
            indices[component] = items;
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
        if(indices[component].length > 1) {
            parseMultipleItems(component, indices[component]);
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
    let product = drinkComponents.products.value//.toLowerCase();
    let hops = (includeHops === true) ? ` <span class="hops">Hops: ${drinkComponents.hops.value}</span>` : '';

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
    for (const [key, value] of Object.entries(QSparams)) {
        QSparams[key] = value.split(',');
    }
    indices.methods = QSparams.a && Math.max(...QSparams.a) < textComponents.methods[dataset].length ? QSparams.a : '0';
    indices.modifiers = QSparams.b && Math.max(...QSparams.b) < textComponents.modifiers[dataset].length ? QSparams.b : '0';
    indices.ingredients = QSparams.c && Math.max(...QSparams.c) < textComponents.ingredients[dataset].length ? QSparams.c : '0';
    indices.products = QSparams.d && Math.max(...QSparams.d) < textComponents.products[dataset].length ? QSparams.d : '0';
    indices.hops = QSparams.e && Math.max(...QSparams.e) < textComponents.hops[dataset].length ? QSparams.e : '0';
}

function validateIndices() {
    // If all indexes are 0 then re-create them randomly
    if (indices.methods == 0 && indices.modifiers == 0 && indices.ingredients == 0 && indices.products == 0 && indices.hops == 0) {
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