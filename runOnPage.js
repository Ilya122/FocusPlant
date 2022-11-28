function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


function RollFileName() {
    let min = 1;
    let max = 4;
    let randomNumber = getRandom(min, max);
    return `NoPass${randomNumber}.png`;
}

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

                let file = RollFileName();
                console.log(`file name is ${file}`);
                notPassImg.src = chrome.runtime.getURL(`Images/${file}`);
                // not using innerHTML as it would break js event listeners of the page
            });
        }
    }

}

check();