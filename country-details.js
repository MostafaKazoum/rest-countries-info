const urlParams = new URLSearchParams(window.location.search);
const countryId = urlParams.get('id');
const toggleButton = document.getElementById('theme-toggler');
const rootElement = document.documentElement; // Refers to <html>
const container = document.querySelector(".country-details");

window.onload = () => {
    getCountryDetails();  // Fixed function name
}

// Handle themes
toggleButton.addEventListener('click', () => {
    rootElement.classList.toggle('dark-theme');
    // Save user preference in localStorage
    if (rootElement.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Load user preference on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') rootElement.classList.add('dark-theme');

async function getCountryDetails() {
    try {
        const response = await axios.get("./data.json");
        const country = response.data.find(c => c.alpha3Code === countryId);

        if (country) {
            console.log(country);
            displayCountry(country);
            loadCountry();  // Fixed the function call to loadCountry
        } else {
            console.log("Country not found");
        }

    } catch (error) {
        console.log(error.message);
    }
}

// Display the country data as HTML elements
function displayCountry(c) {
    const list = `<div class="flag">
                    <img src="${c.flags.svg}" alt="">
                </div>
                <div class="details">
                    <div class="main-info">
                        <h1>${c.name}</h1>
                        <p>Native name: <span>${c.nativeName}</span></p>
                        <p>Population: <span>${c.population}</span></p>
                        <p>Region: <span>${c.region}</span></p>
                        <p>Subregion: <span>${c.subregion}</span></p>
                        <p>Capital: <span>${c.capital}</span></p>
                    </div>
                    <div class="side-info">
                        <p>Top-level domain: <span>${c.topLevelDomain}</span></p>
                        <p>Currencies: <span>${c.currencies.map(e => e.name).join(", ")}</span></p>
                        <p>Languages: <span>${c.languages.map(e => e.name).join(", ")}</span></p>
                    </div>
                    <div class="border-countries">
                        ${
                            (c.borders) ? `<h2>Border countries:</h2>
                        <div class="container">
                            ${handelBorderCountries(c.borders)}
                        </div>` : ""
                        }
                    </div>
                </div>`;

    container.innerHTML = list;
}

// Load country buttons for borders
function loadCountry() {
    const btns = document.querySelectorAll(".borderCountries");

    btns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const countryId = e.target.getAttribute("data-id");
            window.location.href = `country-details.html?id=${countryId}`;
            console.log("Changed to " + countryId);
        });
    });
}

function handelBorderCountries(arr) {
    const list = [];
    for (const el of arr) {
        list.push(`<button class="borderCountries" data-id="${el}">${el}</button>`);
    }
    return list.join("");
}
