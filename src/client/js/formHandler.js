async function getData(formUrl) {

    return await fetch('http://localhost:8080/analyse', {
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            url: formUrl
        })
    }).then(function(resp) {
        return resp.json();
    }).catch(function(err) {
        return;
    })
}



async function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value

    if (Client.urlChecker(formText) != true) {
        alert('Invalid address to summarize!\nThe address should start with http:// or https://');
        return false;
    }

    const content = document.getElementById('results');
    const title = document.getElementById('title');
    title.innerHTML = "Analysing, please wait ...";
    content.innerHTML = "";

    //if offline show some message
    if (!navigator.onLine) {
        title.innerHTML = "Offline! please try again when network connectivity is available.";
        title.style.color = "red";
        return;
    } else {
        title.style.color = null;
    }


    const res = await getData(formText);

    if (!res) {
        title.innerHTML = "Ups, something went wrong!";
    } else {
        const ps = [];
        res.data.forEach(element => {
            const p = document.createElement('p');
            p.innerHTML = element;
            ps.push(p);
        });
        title.innerHTML = "Here is your summary:"
        ps.map(p => {
            content.appendChild(p);
        })
    }
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

    const tripData = await getTripData(place, date);

    console.dir(tripData);

    var trips = JSON.parse(localStorage.getItem('trips'));
    if (!trips) trips = new Array();

    // add trip to trips
    trips.push(tripData);

    //save trips to localstorage
    localStorage.setItem('trips', JSON.stringify(trips));

    // call amethod to add items to the UI
    await displayTrips();

    //alert("Not there yet!!!!");
    // return;
}

const displayTrips = async() => {
    //get trips
    //    const trips =
    //if trips then clear ui elements

    //iterate trips and add trip to ui

    console.log("trips displayed!")
}

export { handleSubmit, getData, addTrip }