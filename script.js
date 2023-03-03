/******w**************
    
    Assignment 4 Javascript
    Name: Tin Le
    Date: 2023-02-02
    Description: Assignment 4 - AJAX

*********************/

function wrongReply(){
    const h2 = document.querySelector('h2.h2');
    const unaccept = document.querySelector('button.unaccept');

    h2.innerHTML = "This isn't a good choice buddy! Click here to go back and process our tool!";
    unaccept.classList.add('is-invisible');
}

function pageVisibility(show){
    const page = document.querySelector('div.content');
    const buttons = document.querySelector('div.wonder');
    const h2 = document.querySelector('h2.h2');

    if (show){
        page.classList.remove('is-invisible');
        buttons.classList.add('is-invisible');
        h2.innerHTML = "Nice choice buddy!!!";
    } 
    else{
        page.classList.add('is-invisible');
        buttons.classList.remove('is-invisible');
    }
}

function formAvailability(enabled) {
    const buttonElement = document.querySelector('button');
    const searchInput = document.querySelector('input.input1');
  
    if (enabled){
      buttonElement.classList.remove('is-loading');
      searchInput.focus();
      searchInput.select();
    } 
    else{
      buttonElement.classList.add('is-loading');
      searchInput.blur();
    }
  }
  
// Display the number of results returned
function checkingBriefResult(district, neighborhood, numberOfResult){
    const h2 = document.querySelector("h2.brief");

    if(numberOfResult == 0){
        h2.innerHTML = `Cannot find any park inside ${district} district`;
    } 
    else if(district !== "" && neighborhood !== ""){
        h2.innerHTML = `Top ${numberOfResult} parks inside ${neighborhood} neighborhood, in ${district} district`;
    }
    else if(district !== ""){
        h2.innerHTML = `Top ${numberOfResult} parks inside ${district} district`;
    }
    else
    {
        h2.innerHTML = `Top ${numberOfResult} parks inside ${neighborhood} neighborhood`;
    }
}

// Make the result table inside HTML file becomes visible
function tableVisibility(show) {
    const parkTable = document.querySelector('table.parks');

    if (show){
        parkTable.classList.remove('is-invisible');
    } 
    else {
        parkTable.classList.add('is-invisible');
    }
}
    
// Add data from a park as td elements within a tr.
function addParkRowIntoTable(table, park) {
const row           = document.createElement('tr');
const district      = document.createElement('td');
const parkName      = document.createElement('td');
const location      = document.createElement('td');
const neighborhood  = document.createElement('td');
const totalArea     = document.createElement('td');

district.innerHTML          = park.district;
parkName.innerHTML          = park.park_name;
location.innerHTML          = park.location_description;
neighborhood.innerHTML      = park.neighbourhood;
totalArea.innerHTML         = park.area_in_hectares;

row.appendChild(district);
row.appendChild(parkName);
row.appendChild(location);
row.appendChild(neighborhood);
row.appendChild(totalArea);
table.appendChild(row);
}

// Loop for all park results that is retrieved from the API database
function addAllParkResults(parks){
    const parkResults = document.querySelector('.parks tbody');
    parkResults.innerHTML = '';

    for(const park of parks){
        addParkRowIntoTable(parkResults, park)
    }
}

// Main processing function to display the data
function mainProcess(parks, district, neighborhood){
    checkingBriefResult(district, neighborhood, parks.length);   
    addAllParkResults(parks);
    tableVisibility(parks.length !== 0);
}

function fetchTheApiLinkWith2Values(searchDistrict, searchNeighborhood){
    const apiURL = 'https://data.winnipeg.ca/resource/tx3d-pfxq.json?' +
                        `$where=lower(district) LIKE lower('${searchDistrict}')` +
                        `AND neighbourhood LIKE upper('${searchNeighborhood}')`
                        '&$order=area_in_hectares ASC' +
                        '&$limit=100';

    fetch(encodeURI(apiURL))
        .then(result => {
            return result.json();
        })
        .then(data => {
            mainProcess(data, searchDistrict, searchNeighborhood);
        })
}

// Fetch the encoded API to retrieve the data with 1 searching value
function fetchTheApiLink(searchValue, constrain){
    if(constrain == "district"){
        const apiURL = 'https://data.winnipeg.ca/resource/tx3d-pfxq.json?' +
                        `$where=lower(district) LIKE lower('${searchValue}')` +
                        '&$order=area_in_hectares ASC' +
                        '&$limit=100';

        fetch(encodeURI(apiURL))
            .then(result => {
                return result.json();
            })
            .then(data => {
                mainProcess(data, searchValue, "");
            })
    }

    if(constrain == "neighborhood"){
        const apiURL = 'https://data.winnipeg.ca/resource/tx3d-pfxq.json?' +
                        `$where=neighbourhood LIKE upper('${searchValue}')` +
                        '&$order=area_in_hectares ASC' +
                        '&$limit=100';
        fetch(encodeURI(apiURL))
            .then(result => {
                return result.json();
            })
            .then(data => {
                mainProcess(data, "", searchValue);
            })  
    }
}

function demoQuery(e) {
    const searchInput   = document.querySelector('input.input1');
    const searchTerm    = e.target.innerHTML;
  
    e.preventDefault();
    searchInput.value   = searchTerm;
    formAvailability(false);
    fetchTheApiLink(searchTerm, "district");
}

function searchingPark(e) {
    e.preventDefault();

    let searchInputDistrict = document.querySelector('input.input1');
    let searchDistrict = searchInputDistrict.value.trim();

    let searchInputNeighborhood = document.querySelector('input.input2');   
    let searchNeighborhood = searchInputNeighborhood.value.trim();

    if (searchDistrict !== '' || searchNeighborhood !== '') {
        formAvailability(false);
        if(searchDistrict == ''){
            fetchTheApiLink(searchNeighborhood, "neighborhood");
        } 
        else if(searchNeighborhood == ''){
            fetchTheApiLink(searchDistrict, "district");
        } 
        else {
            fetchTheApiLinkWith2Values(searchDistrict, searchNeighborhood);
        }
    }  
}

function load(){
    const form              = document.getElementById('form');
    const suggestedLinks    = document.getElementsByClassName('help');

    form.addEventListener("submit", searchingPark);

    for(let link of suggestedLinks){
        link.addEventListener("click", demoQuery);
    }
    
    pageVisibility(false);
    tableVisibility(false);
    formAvailability(true); 

    let accept     = document.querySelector('button.accept');
    let unaccept   = document.querySelector('button.unaccept');

    accept.addEventListener('click', function(){
                                            pageVisibility(true);
                                        });
    unaccept.addEventListener('click', wrongReply);
}

// Adds an event listener to execute onLoad method when page finished loading
document.addEventListener("DOMContentLoaded", load);
