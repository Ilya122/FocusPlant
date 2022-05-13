adder.addEventListener("click", addwebsite);

const sites = { urls: [] };
const allSitesElement = allSites;
// Initialize the form with the user's option settings
chrome.storage.sync.get('sites', (data) => {
    Object.assign(sites, data.sites);

    sites.urls.forEach(urlHost => {
        var li = document.createElement("li");
        let button = document.createElement("button");

        function RemoveSite() {
            const index = sites.urls.indexOf(urlHost);
            if (index > -1) {
                sites.urls.splice(index, 1); // 2nd parameter means remove one item only
            }

            let chilIndex = 0;
            let childrenLength = allSitesElement.children.length;
            for (let i = 0; i < childrenLength; i++) {
                let child = allSitesElement.children[i];
                if (child.innerHTML.includes(urlHost)) {
                    chilIndex = i;
                    break;
                }

            }
            allSitesElement.removeChild(allSitesElement.children[chilIndex]);
            chrome.storage.sync.set({ sites });
        }

        button.innerHTML = '-';
        button.addEventListener('click', RemoveSite);
        li.appendChild(button);
        li.appendChild(document.createTextNode(urlHost));

        allSites.appendChild(li);
    });
});

// // Immediately persist options changes
// optionsForm.debug.addEventListener('change', (event) => {
//     chrome.storage.sync.set({ options });
// });

function addwebsite() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let activeTab = tabs[0];

        let url = new URL(activeTab.url);

        const found = sites.urls.find(element => element == url.host);
        if (found !== undefined) {
            return;
        }
        sites.urls.push(url.host);

        chrome.storage.sync.set({ sites });

        let li = document.createElement("li");
        let button = document.createElement("button");

        function RemoveSite() {
            const index = sites.urls.indexOf(urlHost);
            if (index > -1) {
                sites.urls.splice(index, 1); // 2nd parameter means remove one item only
            }

            let chilIndex = 0;
            let childrenLength = allSitesElement.children.length;
            for (let i = 0; i < childrenLength; i++) {
                let child = allSitesElement.children[i];
                if (child.innerHTML.includes(urlHost)) {
                    chilIndex = i;
                    break;
                }
            }
            allSitesElement.removeChild(allSitesElement.children[chilIndex]);
            chrome.storage.sync.set({ sites });
        }
        button.innerHTML = '-';
        button.addEventListener('click', RemoveSite);
        li.appendChild(button);
        li.appendChild(document.createTextNode(url.host));

        allSitesElement.appendChild(li);
    });

}