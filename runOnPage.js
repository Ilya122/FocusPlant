const sites = { urls: [] };

function check() {
    let currLoc = window.location.host;
    console.log(currLoc);
    chrome.storage.sync.get('sites', (data) => {
        Object.assign(sites, data.sites);

        for (let site of sites.urls) {
            console.log(site);

            if (site === currLoc) {
                // replace everything
                fetch(chrome.runtime.getURL('/PleaseDontOpen.html')).then(r => r.text()).then(html => {
                    document.body.innerHTML = html;
                    document.body.style = "";
                    notPassImg.src = chrome.runtime.getURL("Images/notpass.jpg");

                    // not using innerHTML as it would break js event listeners of the page
                });
            }
        }

    });
}


check();