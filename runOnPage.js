async function check() {
    const sites = await GetSites();

    console.log(sites);
    let currLoc = window.location.host;

    if (!sites.IsWorking) {
        return;
    }

    for (let site of sites.Sites) {
        console.log(site);

        if (site.Url === currLoc) {
            console.log(`Testing ${site.Url}`);

            let isActiveBan = isBanned(site);
            console.log(`Is Banned? ${isActiveBan}`);

            if (!isActiveBan) {
                console.log(`NOT Banning ${site.Url}`);

                // We don't ban now
                continue;
            }
            console.log(`Banning ${site.Url}`);
            // replace everything
            fetch(chrome.runtime.getURL('/PleaseDontOpen.html')).then(r => r.text()).then(html => {
                document.body.innerHTML = html;
                document.body.style = "";
                notPassImg.src = chrome.runtime.getURL("Images/notpass.jpg");
                // not using innerHTML as it would break js event listeners of the page
            });
        }
    }

}

check();