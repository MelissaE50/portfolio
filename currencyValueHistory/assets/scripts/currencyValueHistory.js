/* my api key CzRy184vwLiWhwzMZ_cK4fEdZgUyoHv2*/

 let apiKey = 'CzRy184vwLiWhwzMZ_cK4fEdZgUyoHv2';

       let myChart = null; 

function clearErrors() {
            document.getElementById("basecurrencyerror").innerHTML = "";
            document.getElementById("converttocurrencyerror").innerHTML = "";
            document.getElementById("fromdateerror").innerHTML = "";
            document.getElementById("todateerror").innerHTML = "";
        }

        function validateForm() {
            clearErrors();
            let valid = true;

            const baseCurrency = document.getElementById("basecurrency").value;
            const convertCurrency = document.getElementById("converttocurrency").value;
            const fromDate = document.getElementById("fromdate").value;
            const toDate = document.getElementById("todate").value;

            if (baseCurrency === "") {
                document.getElementById("basecurrencyerror").innerHTML = "Base Currency is Required";
                valid = false;
            }

            if (convertCurrency === "") {
                document.getElementById("converttocurrencyerror").innerHTML = "Convert To Currency is Required";
                valid = false;
            }

            if (fromDate === "") {
                document.getElementById("fromdateerror").innerHTML = "From Date is Required";
                valid = false;
            }

            if (toDate === "") {
                document.getElementById("todateerror").innerHTML = "To Date is Required";
                valid = false;
            }


            return valid;
        }

        async function showResults() {
            if (!validateForm()) {
                return;
            }

            const baseCurrency = document.getElementById("basecurrency").value;
            const convertCurrency = document.getElementById("converttocurrency").value;
            const fromDate = document.getElementById("fromdate").value;
            const toDate = document.getElementById("todate").value;

            // Construct the Polygon.io API URL
            const url = `https://api.polygon.io/v2/aggs/ticker/C:${baseCurrency}${convertCurrency}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${apiKey}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === "OK" && data.results && data.results.length > 0) {
                    displayChart(data.results, baseCurrency, convertCurrency);
                } else {
                    alert("There is no data available for the selected date currencies and/or date range. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                alert("Error obtaining currency data. Please try again.");
            }
        }

        function displayChart(results, baseCurrency, convertCurrency) {
            const dates = [];
            const values = [];

            // Obtain dates and closing values from results
            results.forEach(result => {
                const date = new Date(result.t);
                const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
                dates.push(formattedDate);
                values.push(result.c); // 'c' is the closing price
            });

            // Destroy the previous chart if it exists
            if (myChart) {
                myChart.destroy();
            }

            // Show chart container and set title
            document.getElementById("chartContainer").style.display = "block";
            document.getElementById("chartTitle").innerHTML = `${baseCurrency} to ${convertCurrency}`;

            // Create new chart
            const ctx = document.getElementById("chartjs-0").getContext('2d');
            myChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: `One ${baseCurrency} to ${convertCurrency}`,
                        data: values,
                        fill: false,
                        borderColor: 'hsl(194, 87%, 56%)',
                        backgroundColor: 'hsl(194, 87%, 56%)',
                        tension: 0.2
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: true,
                }
            });
        }

        function clearForm() {
            document.getElementById("basecurrency").value = "";
            document.getElementById("converttocurrency").value = "";
            document.getElementById("fromdate").value = "";
            document.getElementById("todate").value = "";
            
            if (myChart !== null) {
                myChart.destory();
                myChart = null;
            }
        }