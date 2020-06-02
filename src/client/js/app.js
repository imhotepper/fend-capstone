function dateChecker(possibleDate) {
    var datePattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;

    var res = possibleDate.match(datePattern);
    return (res !== null)
}

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
    await saveTripsToCache(tripData);
    displayOneTrip(tripData, getTripData.length);
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
}

document.addEventListener('DOMContentLoaded', function() {
    // your code goes here
    displayTrips();
}, false);


const saveTripsToCache = async(tripData) => {
    var trips = JSON.parse(localStorage.getItem('trips'));
    if (!trips)
        trips = new Array();
    // add trip to trips
    tripData.id = trips.length;
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
        console.log('deleting index:', trip.id)

        //  const idx = index;
        if (confirm(`delete trip to: ${trip.location.name}? `)) {
            console.log('deleting index:', index);
            await delTripFromCache(index);
            await displayTrips();
        }
    });
    mainDiv.appendChild(del);

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

}

const displayNoTrips = async() => {
    const tripsFromCache = await getTripsFromCache();
    const noTripsSection = document.getElementById('noTrips')
    console.log('no trips', noTripsSection);
    noTripsSection.style.display = !tripsFromCache || tripsFromCache.length == 0 ? "block" : "none";
}



export { addTrip, dateChecker }