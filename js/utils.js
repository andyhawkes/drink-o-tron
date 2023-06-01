Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateHistory(replace) {
    let state = {
        'methodsIndex': indices.methods,
        'modifiersIndex': indices.modifiers,
        'ingredientsIndex': indices.ingredients,
        'productsIndex': indices.products,
        'hopsIndex': indices.hops ? indices.hops : 0
    };
    let title = zeitgeistRecipe;
    let url = `${window.location.pathname}?a=${indices.methods}&b=${indices.modifiers}&c=${indices.ingredients}&d=${indices.products}&e=${indices.hops}`;
    if(replace == true){
        history.replaceState(state, title, url);
    } else {
        history.pushState(state, title, url);
    }
}

function updatePageTitle(title) {
    title = (title != null) ? `${title} | ${appNames[dataset]}` : `${appNames[dataset]}`;
    document.title = title;
    document.getElementsByTagName('meta').namedItem('twitter:title').setAttribute('content', title);
}

function updateTwitterLink(introText, messageText) {
    let tweetText = (introText != null) ? introText : '';
    tweetText += (messageText != null) ? messageText : '';
    let url = window.location;
    let message = `${tweetText} - ${url} ${twitterHashtag}`;
    let encodedMessage = encodeURIComponent(message);
    let tweetURL = twitterBaseURL + encodedMessage;
    let tweetButtons = document.querySelectorAll('.tweetButton');
    tweetButtons.forEach(el => el.setAttribute("href", tweetURL));
}

function checkQSParams(checkKey, checkValue) {
    let QSparams = Object.fromEntries(new URLSearchParams(location.search));
    if (QSparams[checkKey]) {
        if(checkValue){
            if (QSparams[checkKey] == checkValue){
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
}

function countUnique(iterable) {
    return new Set(iterable).size;
}