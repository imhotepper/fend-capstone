// async function getData(formUrl) {

//     return await fetch('http://localhost:8080/analyse', {
//         credentials: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         method: "POST",
//         body: JSON.stringify({
//             url: formUrl
//         })
//     }).then(function(resp) {
//         return resp.json();
//     }).catch(function(err) {
//         return;
//     })
// }



// async function handleSubmit(event) {
//     event.preventDefault()

//     // check what text was put into the form field
//     let formText = document.getElementById('name').value

//     if (Client.urlChecker(formText) != true) {
//         alert('Invalid address to summarize!\nThe address should start with http:// or https://');
//         return false;
//     }

//     const content = document.getElementById('results');
//     const title = document.getElementById('title');
//     title.innerHTML = "Analysing, please wait ...";
//     content.innerHTML = "";

//     //if offline show some message
//     if (!navigator.onLine) {
//         title.innerHTML = "Offline! please try again when network connectivity is available.";
//         title.style.color = "red";
//         return;
//     } else {
//         title.style.color = null;
//     }


//     const res = await getData(formText);

//     if (!res) {
//         title.innerHTML = "Ups, something went wrong!";
//     } else {
//         const ps = [];
//         res.data.forEach(element => {
//             const p = document.createElement('p');
//             p.innerHTML = element;
//             ps.push(p);
//         });
//         title.innerHTML = "Here is your summary:"
//         ps.map(p => {
//             content.appendChild(p);
//         })
//     }
// }

const getTripData = async(place, date) => {
    try {
        const resp = await fetch(`http://localhost:8080/forcast?place=${place}&date=${date}`);
        const respData = await resp.json();
        return respData;

    } catch (error) {
        //TODO: propper error handler
        alert('Erorr getting card DATA!\n', error)
    }
}

async function addTrip(event) {
    event.preventDefault();

    const place = document.getElementById('place').value;
    const date = document.getElementById('date').value;

    if (Client.dateChecker(date) != true) {
        alert('Invalid date for the trip!\nThe date should be in the following format: yyyy-MM-dd');
        return false;
    }

    const tripData = await getTripData(place, date);

    //console.dir(tripData);

    await saveTripsToCache(tripData);

    displayOneTrip(tripData, getTripData.length);
    // call amethod to add items to the UI
    //await displayTrips();
}


const displayTrips = async() => {
    //get trips
    var trips = await getTripsFromCache();

    if (!trips) return;

    //if trips then clear ui elements
    const tripsUI = document.getElementById('results');
    tripsUI.innerHTML = "";

    //iterate trips and add trip to ui
    trips.map((trip, index) => {
        displayOneTrip(trip, index, tripsUI);
    })

    //console.log("trips displayed!")
}

document.addEventListener('DOMContentLoaded', function() {
    // your code goes here
    displayTrips();
    // console.log('loading trips')
}, false);


const saveTripsToCache = async(tripData) => {
    var trips = JSON.parse(localStorage.getItem('trips'));
    if (!trips)
        trips = new Array();
    // add trip to trips
    trips.push(tripData);
    //save trips to localstorage
    localStorage.setItem('trips', JSON.stringify(trips));
}


const getTripsFromCache = async() => {
    var trips = JSON.parse(localStorage.getItem('trips'));
    if (!trips) return null;
    return trips;
}


const delTripFromCache = async(index) => {
    let trips = await getTripsFromCache();
    if (!trips) return null;

    trips.splice(index, 1);
    localStorage.setItem('trips', JSON.stringify(trips));
    await displayNoTrips();
}

async function displayOneTrip(trip, index, tripsUI) {
    //show no trips on screen
    await displayNoTrips()
    let scrollLast = false;
    if (!tripsUI) {
        tripsUI = document.getElementById('results');
        scrollLast = true;
    }

    const txt = `Trip to ${trip.location.name}, ${trip.location.countryCode} on ${trip.date} `;
    let mainDiv = document.createElement('div');
    mainDiv.style.border = "1px solid grey";
    mainDiv.style.marginBottom = "50px";
    mainDiv.style.display = "flex";
    mainDiv.style.flexDirection = "column";
    //delete icon
    const del = document.createElement('a');
    del.innerText = "X";
    del.href = "#";
    del.style.alignSelf = "flex-end";
    del.style.margin = "10px";
    del.style.textDecoration = "none";
    del.addEventListener('click', async(ev) => {
        const idx = index;
        if (confirm('delete this trip? ')) {
            await delTripFromCache(idx);
            await displayTrips();
        }
    });
    mainDiv.appendChild(del);
    // if (trip.image) {
    //     // mainDiv.style.backgroundImage = `url("${trip.image.webformatURL}")`;
    //     // mainDiv.style.backgroundSize = "cover";
    // }


    //weather image
    if (trip.weather.icon) {
        let wDiv = document.createElement('div');
        wDiv.style.display = "flex";
        wDiv.style.alignItems = "center";
        wDiv.style.justifyContent = "center";
        let img = document.createElement('img');
        img.src = `icons/${trip.weather.icon}.png`;
        img.style.height = "80px";
        wDiv.appendChild(img);
        let span = document.createElement('div');
        span.innerHTML = `${trip.weather.temperature}&deg; with ${trip.weather.description}`;
        wDiv.appendChild(span);
        mainDiv.appendChild(wDiv);
    } else {
        let span = document.createElement('div');
        span.innerHTML = `No weather available!`;
        span.style.fontSize = "1.3em";
        span.style.color = "orange";
        span.style.padding = "10px";
        mainDiv.appendChild(span);
    }
    let picDiv = document.createElement('div');
    let img = null;
    if (trip.image && trip.image.webformatURL) {
        let img = document.createElement('img');
        //console.dir(trip.image)
        img.src = trip.image.webformatURL;
        img.style.paddingLeft = "20px";
        img.style.paddingRight = "20px";
        mainDiv.appendChild(img);

        if (scrollLast == true) {
            img.addEventListener('load', () => {
                img.scrollIntoView({ behavior: 'smooth' });
            })
        }
    }

    let p = document.createElement('p');
    p.innerText = txt;
    mainDiv.appendChild(p);
    tripsUI.appendChild(mainDiv);
    if (!img && scrollLast == true)
        tripsUI.lastChild.scrollIntoView({ behavior: 'smooth' });

    // mainDiv.scrollIntoView({ behavior: 'smooth' });
}

const displayNoTrips = async() => {
    const tripsFromCache = await getTripsFromCache();
    const noTripsSection = document.getElementById('noTrips')
    console.log('no trips', noTripsSection);
    noTripsSection.style.display = !tripsFromCache || tripsFromCache.length == 0 ? "block" : "none";
}



export { addTrip }