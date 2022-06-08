document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Now Loaded');
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const brewSearch = encodeURIComponent(document.getElementById('searchBrews').value);
        // API does not return pagination for results.
        // Must fetch pages manually and then filter out empty arrays to get all results
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => 
            fetch(`https://api.openbrewerydb.org/breweries?by_state=${brewSearch}&per_page=50&page=${id}`).then(res => res.json())
        )).then(data => { for (let i = 1; i < 10; i++) {
            let breweries = data.filter(item => item.length > 0)[i - 1] 
            console.log(breweries.filter(Boolean)); 
            }    
        });
        
        
            // fetch(`https://api.openbrewerydb.org/breweries?by_state=${brewSearch}&per_page=50&page=1`)
        // .then(res => res.json())
        // // .then(data => {
        //     // do {
        //     //     fetch(`https://api.openbrewerydb.org/breweries?by_state=${brewSearch}&per_page=50&page=${i}`)
        //     //     .then(res => res.json())
        //     //     .then(data => console.log(data));
        //     //     i = i + 1;
        //     // } while (data.length > 0)
        // // })
        // .then(data => { for (i = 1; data.length > 0; i++){
        //     fetch(`https://api.openbrewerydb.org/breweries?by_state=${brewSearch}&per_page=50&page=${i}`)
        //     .then(res => res.json())
        //     .then(data => console.log(data))
        //     }
        // })
    })


});