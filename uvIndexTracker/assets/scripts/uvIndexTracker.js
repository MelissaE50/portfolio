let myChart = null;

function clearErrors() {
    document.getElementById("locationerror").innerHTML = "";
}

function validateForm() {
    clearErrors();
    let valid = true;

    const location = document.getElementById("location").value.trim();

    if (location === "") {
        document.getElementById("locationerror").innerHTML = "City or ZIP Code is required";
        valid = false;
    }

    return valid;
}


async function displayUVData() {
    if (!validateForm()) {
        return;
    }

    const location = document.getElementById("location").value.trim();

    try {
        // Enter Zip Code or City using OpenMeteo.com geocoding to find location
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?` +
            `name=${encodeURIComponent(location)}` +
            `&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("Location not found. Please try a different city or ZIP code.");
            return;
        }

        const loc = geoData.results[0];
        const lat = loc.latitude;
        const lon = loc.longitude;
        const locationName = loc.name;


        // Get UV Index (5 days before + today + 5 days after)
        const uvUrl =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}&longitude=${lon}` +
            `&daily=uv_index_max` +
            `&past_days=5&forecast_days=6` +
            `&timezone=auto`;

        const uvResponse = await fetch(uvUrl);
        const uvData = await uvResponse.json();

        if (!uvData.daily) {
            alert("UV data not available for this location.");
            return;
        }

        const dates = uvData.daily.time;
        const uvValues = uvData.daily.uv_index_max;

        displayChart(dates, uvValues, locationName);

    } catch (error) {
        console.error(error);
        alert("Error retrieving UV data. Please try again.");
    }
}

function displayChart(dates, uvValues, locationName) {
    const formattedDates = dates.map(d => {
        const date = new Date(d);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    if (myChart) {
        myChart.destroy();
    }

    document.getElementById("chartContainer").style.display = "block";
    document.getElementById("chartTitle").innerHTML = `5 Days Before & After for ${locationName}`;

    const ctx = document.getElementById("chartjs-0").getContext('2d');
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: formattedDates,
            datasets: [{
                label: `Daily UV Index`,
                data: uvValues,
                fill: true,
                borderColor: 'rgba(105, 220, 235, 1)',
                backgroundColor: 'rgba(5, 140, 173, 0.2)',
                tension: 0.3
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true,
            scales: {
                yAxes: [{
                    ticks: { beginAtZero: true },
                    scaleLabel: {
                        display: true,
                        labelString: 'UV Index'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }]
            }
        }
    });
}

function clearForm() {
    document.getElementById("location").value = "";
    clearErrors();

    document.getElementById("chartContainer").style.display = "none";
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
}
