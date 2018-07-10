let tweets = [];
let startTweets = 0;
let filteredTweets = [];
const TWEETS_CONTAINER = document.querySelector("#cards");
const tagsHtml = document.querySelector("#tags");
const getBackButton = document.querySelector("#getBackButton");
const ascendingButton = document.querySelector("#asc");
const descendingButton = document.querySelector("#desc");
const deleteTweetButtons = document.querySelectorAll(".deleteButton");
const tagsButtons = document.querySelectorAll(".tag");
const inputSearch = document.querySelector('#inputSearch');
const sortTags = [];
const sortBy = 'sortBy';

const render = () => {
    fetch('https://api.myjson.com/bins/152f9j')
    .then(response => response.json())
    .then(data => {
        tweets.push(...data.data);
        filteredTweets = tweets;
        showTags();
        // showTweets(data);
        let sortingFromLocal = localStorage.getItem(sortBy);
        if (sortingFromLocal===null){
            sortDescending(filteredTweets);
        } else if (sortingFromLocal === "ascending") {
                sortAscending(filteredTweets);
        } else if (sortingFromLocal === "descending") {
                sortDescending(filteredTweets);  
        }
    })
    .catch(err =>{
        console.log(err);
    });
}

render();

const showTweets = tweets => {
        for(let i = startTweets; i < startTweets+10 && i < tweets.length; ++i){
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const DATE = new Date(tweets[i].createdAt);
        let tweet =
        `
        <div class='card' id="${i}">
            <img src=${tweets[i].image} alt="Avatar" />
            <div class='container'>
                <div class="deleteButton" onclick='deleteTweet(event)'></div>
                <div class="title">${tweets[i].title}</div>
                <div class="description">${tweets[i].description}</div>
                <div class='date' data-old="${tweets[i].createdAt}">${DATE.getDate()} ${monthNames[DATE.getMonth()]} ${DATE.getHours()} : ${DATE.getMinutes()}</div>
                <div class='tags'>${tweets[i].tags}</div>
            </div>
        </div>
        `;
        TWEETS_CONTAINER.innerHTML += tweet;
    }

    inputSearch.addEventListener("input", search);
    ascendingButton.addEventListener('click', () => sortAscending(filteredTweets));
    descendingButton.addEventListener('click', () => sortDescending(filteredTweets));

}



window.onscroll = () => {
    let pageHeight = document.documentElement.offsetHeight,
        windowHeight=window.innerHeight,
        scrollPosition=window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
    if (pageHeight <= windowHeight+scrollPosition && startTweets < 50) {
        showTweets(tweets);
        startTweets+=10;
    }
};

const showTags = () => {

    let tags = [];
    let html = '';

    tweets.forEach((tweet) => {
        tweet.tags.forEach((tag) => {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        });
    });

    html = tags.map(tag => `<div id="${tag}" class="tag filterButton" onclick="sortByTags()">${tag}</div>`).join('');

    tagsHtml.innerHTML = html;

}

const scrollTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    TWEETS_CONTAINER.innerHTML = "";
    startTweets = 0;
    showTweets(filteredTweets);
}

getBackButton.addEventListener('click', scrollTop);

const search = () => {
    TWEETS_CONTAINER.innerHTML = "";
    let filter = inputSearch.value.toUpperCase();
    let searchTweets = tweets.slice();
    tweets.map(tweet => {
    title = tweet.title.toUpperCase().indexOf(filter);
    if (title < 0) {
        searchTweets.splice(searchTweets.indexOf(tweet), 1);
    }
});
    filteredTweets = searchTweets;
    startTweets = 0;
    showTweets(filteredTweets);
}


const deleteTweet = (event) => {
    TWEETS_CONTAINER.innerHTML = "";
    let tweet = event.target.parentNode.parentNode;
    let filter = tweet.querySelector(".date").dataset.old;
    let asideTweets = filteredTweets.slice();
    filteredTweets.map(filteredTweet => {
        let date = filteredTweet.createdAt;
        if (date.indexOf(filter) > -1) {
            asideTweets.splice(asideTweets.indexOf(filteredTweet), 1);
        } 
    });

    tweets = asideTweets;
    filteredTweets = asideTweets;
    startTweets = 0;
    showTweets(filteredTweets);
}

const sortAscending = (filteredTweets) => {
    TWEETS_CONTAINER.innerHTML = "";
    filteredTweets = filteredTweets.sort((tweet1, tweet2) => {
        const date1 = new Date(tweet1.createdAt), date2 = new Date(tweet2.createdAt);
        return date2 < date1 ? 1 : -1;
    });
    showTweets(filteredTweets);
    localStorage.setItem(sortBy, 'ascending');
}

const sortDescending = (filteredTweets) => {
    TWEETS_CONTAINER.innerHTML = "";
    filteredTweets = filteredTweets.sort((tweet1, tweet2) => {
        const date1 = new Date(tweet1.createdAt),
            date2 = new Date(tweet2.createdAt);
        return date2 < date1 ? -1 : 1;
    });
    showTweets(filteredTweets);
    localStorage.setItem(sortBy, 'descending');
}


const sortByTags = () => {
    TWEETS_CONTAINER.innerHTML = "";
    let tagHtml = event.target;
    tagHtml.classList.contains('active')? tagHtml.classList.remove('active'):tagHtml.classList.add('active');
    sortTags.push(tagHtml.innerHTML);
    
    filteredTweets = filteredTweets.sort(comp)
    startTweets = 0;
    showTweets(filteredTweets);
}

const comp = (tweet1, tweet2) => {
    let c1 = 0, c2 = 0;
    sortTags.map(sortTag => {
        c1 += (tweet1.tags.includes(sortTag) ? 1 : 0);
        c2 += (tweet2.tags.includes(sortTag) ? 1 : 0);
    });

    return c2 - c1;
}