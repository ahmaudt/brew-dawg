document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Now Loaded');
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let div = document.querySelector('.list-group');
        div.innerHTML = '';
        // const div  = document.createElement('div');
        // div.className = 'list-group';          
        const brewSearch = encodeURIComponent(document.getElementById('searchBrews').value);
        // API does not return pagination for results.
        // Must fetch pages manually and then filter out empty arrays to get all results
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9].map(id => 
            fetch(`https://api.openbrewerydb.org/breweries?by_state=${brewSearch}&per_page=50&page=${id}`).then(res => res.json())
        )).then(data => { for (let i = 1; i < 10; i++) {
            let breweries = [];
            let results = data.filter(item => item.length > 0)[i - 1]
            breweries.push(results.filter(Boolean));
            // breweries = breweries.filter(Boolean);
            if (breweries.length > 0) {
                breweries.forEach(brewery => {
                    // console.log(brewery)y
                    brewery.forEach(brew => {
                        // console.log(brew);
                        const label = document.createElement('label');
                        label.classList.add("list-group-item", "list-group-item-action", "d-flex", "gap-3", "py-3");
                        label.innerHTML = `<strong><a href="${brew.website_url}">${brew.name}</a></strong>`;
                        // document.body.append(div);
                        div.append(label);
                    })
                })
            }}
        });
    })
});