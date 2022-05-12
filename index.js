document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Now Loaded')
    let brewSearch = document.getElementById('searchBrews');
    // brewSearch.addEventListener('input', (e) => {
    //     console.log(e.target.value)
    // });

    const brewForm = document.querySelector('form');
    brewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let brewSearch = e.target.searchBrews.value;
        fetch(`https://api.openbrewerydb.org/breweries/search?query=${brewSearch}`)
        .then(res => res.json())
        .then(data => console.log(data));
    });

});