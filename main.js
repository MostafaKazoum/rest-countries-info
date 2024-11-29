const toggleButton = document.getElementById('theme-toggler');
const rootElement = document.documentElement; // Refers to <html>
const dropDownBtn = document.querySelector(".dorpDown-btn")
const menu = document.querySelector(".menu")
const menuBtns = menu.querySelectorAll("button")
const container = document.querySelector(".countries")
const loader = document.querySelector(".loader")
const notFound = document.querySelector(".not-found")
const searchForm = document.getElementById("search")

//fetch data as soon as the page loads
window.onload = ()=>{
    getCountries();
}

//handle themes
toggleButton.addEventListener('click', () => {
    console.log("theme switched");
    
  rootElement.classList.toggle('dark-theme');
  // Save user preference in localStorage
  if (rootElement.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});


// Load user preference on page load
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') rootElement.classList.add('dark-theme');

//drop down menu
dropDownBtn.onclick = ()=>{
    menu.classList.toggle("hide")
}

// handel search form
searchForm.onsubmit = (e)=>{
    e.preventDefault()
    const text = e.target.search.value; 
    e.target.search.value = ""
    getCountries(text)
}


//handel the filter opations
menuBtns.forEach(btn => {
    btn.onclick = (e)=>{
        getCountries(e.target.id)
        console.log(e.target.id);
        menu.classList.toggle("hide")
    }
});

//fetch data from the json file using axios
async function getCountries(params = "") {
    try {
        const response = await axios.get("./data.json")
        const data = response.data

        notFound.classList.add("hide");
        loader.classList.remove("hide")
        container.innerHTML = ""
        displayCountries(data,params)
        
    } catch (error) {
        console.log(error.message);
        
    }
}


// Display the data
function displayCountries(countries,keyword = ""){
    let list;
    if(keyword == "" || keyword == "all"){
        list = countries
        console.log("no keyword");
        
    }else{
        console.log("keyword diticted");

        list = filterList(countries,keyword)
    }
    
    if(list.length ==  0){
        notFound.classList.remove("hide");
    }
    console.log("list : " + list);
    const countriesList = list.map(country =>{
        return `
                <div data-id="${country.alpha3Code}"  class="country">
                    <img src="${country.flags.svg}" alt="flag" class="flag">
                    <div class="info">
                        <h2 class="Name">${country.name}</h2>
                        <p class="population">Population: <span id="population">${new Intl.NumberFormat().format(country.population)}</span></p>
                        <p class="region">Region: <span id="region">${country.region}</span></p>
                        <p class="capital">Capital: <span id="capital">${country.capital}</span></p>
                    </div>
                </div>
        `
    }).join("")

    setTimeout(()=>{
        loader.classList.add("hide")
        container.innerHTML = countriesList
        handleEvents()
    },500)
}

//fliter countries based on keywords
function filterList(list, keyword) {
    const filteredList = list.filter(item => 
        item.region.toLowerCase() === keyword.toLowerCase() || 
        item.name.toLowerCase().includes(keyword.toLowerCase())
    );
    console.log(filteredList); 
    
    return filteredList; 
}

//handle the click events on each country
function handleEvents(){
    const countries = document.querySelectorAll(".country")

    countries.forEach(country => {
        country.addEventListener("click",()=>{
            const countryId = country.getAttribute("data-id")

            window.location.href = `country-details.html?id=${countryId}`

        })
    })

}