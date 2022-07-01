document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Now Loaded');
    const form = document.querySelector('form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const resultsDiv = document.querySelector('.list-group');
        resultsDiv.classList.add('align-self-start');
        // deletes old results if they exist
        resultsDiv.innerHTML = '';
        const usrTxt = document.querySelector('input');
        function getParams(input) {
            let url = '';
            let userInput = encodeURIComponent(input.value);
            if (input.id === "searchState") {
                url = `by_state=${userInput}`
            } else if (input.id === "searchCity") {
                url = `by_city=${userInput}`
            } else if (input.id = "searchName") {
                url = `by_name=${userInput}`
            } else {
                url = `by_type=${userInput}`
            }
            return url;
        }
        let brewSearch = getParams(usrTxt);
        
        // API does not return pagination for results.
        // So, fetch maximum of 9 pages manually, then filters empty arrays to get all results
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(id => 
                fetch(`https://api.openbrewerydb.org/breweries?${brewSearch}&per_page=50&page=${id}`).then(res => res.json())
            )).then(data => { for (let i = 1; i < 10; i++) {
                let breweries = [];
                let results = data.filter(item => item.length > 0)[i - 1];
                breweries.push(results.filter(Boolean));
                if (breweries.length > 0) {
                    breweries.forEach(brewery => {
                        brewery.forEach(brew => {
                            const brewAnchor = document.createElement('a');
                            brewAnchor.href = `${brew.website_url}`;
                            const flexDiv = document.createElement('div');
                            const innerDiv = document.createElement('div');
                            brewAnchor.classList.add("list-group-item", "list-group-item-action", "d-flex", 'gap-3', 'py-3');
                            flexDiv.classList.add("d-flex", "w-100", 'justify-content-between');
                            let innerFlexContent = document.createElement('small');
                            innerFlexContent.classList.add("opacity-50", "text-nowrap");
                            console.log(brew);
                            let street = `${brew.street}`;
                            let city = `${brew.city}`;
                            let state = `${brew.state}`;
                            let postalCode = `${brew.postal_code}`;

                            let addr = encodeURIComponent(`${street}+${city}+${state}+${postalCode}`);
                            console.log(addr)

                            innerFlexContent.innerHTML = `<a href='https://www.google.com/maps?saddr=My+Location&daddr=${addr}'>${brew.city}, ${brew.state} <i class="fa-solid fa-map-location-dot"></i></a>`;
                            const brewType = () => {e
                                if (brew.brewery_type === 'micro') {
                                    return `<h5 class='mb-0'><i class="fa-solid fa-beer-mug pe-1"></i>${brew.name}</h5><p class='mb-0 opacity-75'>${brew.brewery_type}</p>`
                                } else if (brew.brewery_type === 'brewpub') {
                                    return `<h5 class="mb-0"><i class="fa-solid fa-burger-glass pe-1"></i>${brew.name}</h5><p class="mb-0 opacity-75">${brew.brewery_type}</p>`
                                } else if (brew.brewery_type === 'large') {
                                    return `<h5 class="mb-0"><i class="fa-solid fa-buildings pe-2"></i>${brew.name}</h5><p class="mb-0 opacity-75">${brew.brewery_type}</p>`
                                } else if (brew.brewery_type === 'planning') {
                                    return `<h5 class="ms-0 mb-0"><span class="fa-layers fa-fw pe-3 ps-0"><i class="fa-thin fa-map ps-0"></i><i class="fa-solid fa-road" data-fa-transform='shrink-4 down-6 right-8'></i></span>${brew.name}</h5><p class="mb-0 opacity-75">${brew.brewery_type} phase</p>`
                                } else if (brew.brewery_type === 'regional') {
                                    return `<h5 class="mb-0"><i class="fa-solid fa-route-interstate pe-1"></i>${brew.name}</h5><p class="mb-0 opacity-75">${brew.brewery_type}</p>`
                                } else if (brew.brewery_type === 'contract') {
                                    return `<h5 class="mb-0"><i class="fa-solid fa-file-contract pe-1"></i>${brew.name}</h5><p class="mb-0 opacity-75">${brew.brewery_type}</p>`
                                } else {
                                    return `<h5 class="mb-0">${brew.name}</h5><p class="mb-0 opacity-75">${brew.brewery_type}</p>`
                                }
                            }
                            // brewAnchor.innerHTML = brewType();
                            resultsDiv.append(brewAnchor);
                            brewAnchor.append(flexDiv);
                            innerDiv.innerHTML = brewType();
                            flexDiv.append(innerDiv)
                            innerDiv.after(innerFlexContent);
                        })
                    })
                }}
            })
    })
});