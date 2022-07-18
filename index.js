document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Now Loaded');
    const form = document.querySelector('form');


    let selection = document.querySelector('select');
    selection.onchange = searchByInput;

    // Helper functions

    function setAttrs(element, attrs) {
        Object.keys(attrs).forEach(attr => {
            element.setAttribute(attr, attrs[attr]);
        })
    }

    function likeBrew(icon) {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(e.target)
        })
    }
    

    function searchByInput(e) {
        let searchBy = document.getElementById('searchBy');
        let searchID = searchBy.selectedOptions[0].value;
        let searchInput = document.createElement('input');
        let searchBtn = document.createElement('button');
        searchBtn.setAttribute('type', 'submit');
        searchBtn.classList.add('btn', 'btn-primary', 'rounded-1', 'mt-3');
        searchBtn.innerText = 'Search';
        searchInput.setAttribute('type', 'text');
        searchInput.id = searchID.toString()
        searchInput.classList.add('form-control-sm', searchID.toString(), 'rounded-0', 'mt-2');
        console.log(searchInput.classList[1]);

        // searchInput.id = `${searchID}`;
        // searchInput.class = 'form-control';
        if (searchBy.nextElementSibling.tagName === 'INPUT') {
          let currentInput = document.querySelector('input');
          let currentBtn = document.querySelector('button');
            currentInput.replaceWith(searchInput);
            // currentBtn.replaceWith(searchBtn);

        } else {
            searchBy.after(searchInput);
            // searchInput.after(searchBtn);
        }
      }
    
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
            if (input.classList[1] === "State") {
                url = `by_state=${userInput}`
            } else if (input.classList[1] === "City") {
                url = `by_city=${userInput}`
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
                            let brewId = `${brew.name[0]+brew.name[1]+brew.name[2]+brew.name[3]+brew.name[4]}`;
                            let brewDiv = document.createElement('div');
                            brewDiv.classList.add("list-group-item", "list-group-item-action", "d-flex", "gap-3", "py-3");
                            const brewAnchor = document.createElement('a');
                            const divAttributes = {
                                "data-bs-toggle": 'modal',
                                "data-bs-target": `#${brewId}`
                            }

                            // setAttrs(brewDiv, divAttributes);
                            brewAnchor.innerHTML = `<div class='fa-2x'><i class="fa-light fa-heart float-start pb-2"></i></div>`;
                            let modalAnchors = Array.from(document.querySelectorAll('h4.mb-0'));
                            modalAnchors.forEach(anchor => {
                                setAttrs(anchor, divAttributes);
                                // anchor.id = `${brew.name[0]+brew.name[1]+brew.name[2]+brew.name[3]+brew.name[4]}`;
                                anchor.addEventListener('shown.bs.modal', () => {
                                    e.target.focus();
                                })
                            });
                            // let like = document.querySelector('i');
                            // like.addEventListener('mouseover', (e) => {
                            //     e.target.classList.remove('fa-light');
                            //     e.target.classList.add('fa-solid');
                            // })
                            // brewDiv.addEventListener('shown.bs.modal', (e) => {
                            //      e.target.focus();
                            // })

                            let modal = document.createElement('div');
                            modal.innerHTML = `<div class='modal' id=${brewId} tabindex='-1'><div class='modal-dialog modal-dialog-centered'><div class='modal-content'><div class='modal-header'><h4 class='modal-title'>${brew.name}</h4><button type='button' class='close' data-bs-dismiss='modal'>&times;</button></div><div class='modal-body'><p>View their homepage<a href=${brew.website_url}>here</a></p></div><div class='modal-footer'><button type='button' class='btn btn-primary' data-bs-dismiss='modal'>Close</button></div></div></div></div>`;

                            const flexDiv = document.createElement('div');
                            const innerDiv = document.createElement('div');
                            flexDiv.classList.add("d-flex", "w-100", 'justify-content-between');
                            let innerFlexContent = document.createElement('small');
                            innerFlexContent.classList.add("opacity-50", "text-nowrap");
                            console.log(brew);
                            let street = `${brew.street}`;
                            let city = `${brew.city}`;
                            let state = `${brew.state}`;
                            let postalCode = `${brew.postal_code}`;

                            let addr = encodeURIComponent(`${street}+${city}+${state}+${postalCode}`);
                            let details = `<h5 class='mb-0 opacity-75'>${brew.brewery_type}</h5><p><a class='ml-5 pl-5' href='https://www.google.com/maps?saddr=My+Location&daddr=${addr}'>${brew.city}, ${brew.state} <i class='fa-solid fa-map-location-dot'></i></a></p>`

                            const brewType = () => {
                                if (brew.brewery_type === 'micro') {
                                    return `<h4 class='mb-0' id=${brewId}><i class="fa-solid fa-beer-mug pe-1 fa-2px"></i>${brew.name}</h4>${details}`;
                                } else if (brew.brewery_type === 'brewpub') {
                                    return `<h4 class="mb-0" id=${brewId}><i class="fa-solid fa-burger-glass pe-1 fa-2x"></i>${brew.name}</h4>${details}`;
                                } else if (brew.brewery_type === 'large') {
                                    return `<h4 class="mb-0" id=${brewId}><i class="fa-solid fa-buildings pe-2 fa-2x"></i>${brew.name}</h4>${details}`;
                                } else if (brew.brewery_type === 'planning') {
                                    return `<h4 class="ms-0 mb-0" id=${brewId}><i class="fa-thin fa-map ps-0"></i>${brew.name}</h4>${details}`;
                                } else if (brew.brewery_type === 'regional') {
                                    return `<h4 class="mb-0" id=${brewId}><i class="fa-solid fa-route-interstate pe-1 fa-2x"></i>${brew.name}</h4>${details}`;
                                } else if (brew.brewery_type === 'contract') {
                                    return `<h4 class="mb-0" id=${brewId}><i class="fa-solid fa-file-contract pe-1 fa-2x"></i>${brew.name}</h4>${details}`;
                                } else {
                                    return `<h4 class="mb-0" id=${brewId}>${brew.name}</h4>${details}`;
                                }
                            }
                            // brewAnchor.innerHTML = brewType();
                            resultsDiv.append(brewDiv);
                            brewDiv.append(brewAnchor);
                            brewAnchor.append(flexDiv);
                            innerDiv.innerHTML = brewType();
                            flexDiv.append(innerDiv)
                            innerDiv.after(innerFlexContent);
                            resultsDiv.before(modal);
                            
                            // innerFlexContent.innerHTML = ``;

                            // const popover = document.querySelectorAll('[data-bs-toggle="popover"]');
                            // const popoverIntialize = new bootstrap.Popover(popover);
                        })
                        let hearts = Array.from(document.querySelectorAll('.fa-heart'));
                        hearts.forEach(heart => {
                            heart.addEventListener('click', (e) => {
                                let classList = Array.from(heart.classList);
                                if (classList.includes('fa-solid')) {
                                    heart.classList.remove('fa-solid');
                                    heart.classList.add('fa-light');
                                } else {
                                    heart.classList.remove('fa-light');
                                    heart.classList.add('fa-solid');
                                }
                            })
                        })
                    })
                }}
            })
    })
    form.reset();
});