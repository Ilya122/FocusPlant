const allSitesElement = allSites;
const isAppActiveCheckBox = isAppActive;

adder.addEventListener("click", addwebsite);
backButton.addEventListener('click', TransitionToMainPage);
saveButton.addEventListener('click', () => {
    SaveSites();
    TransitionToMainPage();
});

function SaveSites() {
    let sites = window.sites;
    chrome.storage.sync.set({ sites });
}

function transitionToModifyPage(siteConfig) {
    // Edit the configuration page to show the current siteConfig:
    $("#page1").hide();
    $("#page2").show();

    let banAllTimeCheck = $("#banAllTimeCheck");
    let allDayMinTime = $('allDayMinTime');
    let allDayMaxTime = $('allDayMaxTime');
    banAllTimeCheck.checked(siteConfig.BanAllTime);

    if (banAllTimeCheck.checked) {
        $("#weekDaysDayPicker").hide();
        $("weekDayTimePick").hide();
    } else {
        $("#weekDaysDayPicker").show();
        $("weekDayTimePick").show();
    }

    banAllTimeCheck.on('click', function () {

        siteConfig.BanAllTime =  this.checked;

        if(this.checked) {
            $("#weekDaysDayPicker").hide();
            $("weekDayTimePick").hide();
        }else{
            $("#weekDaysDayPicker").show();
            $("weekDayTimePick").show();  
        }

        SaveSites();

    });
    // Change time values 
    ChangeTimeElementTime(allDayMinTime, siteConfig.DailyTime.StartHour, siteConfig.DailyTime.StartMinutes)
    ChangeTimeElementTime(allDayMaxTime, siteConfig.DailyTime.EndHour, siteConfig.DailyTime.EndMinutes)

    // Day of weeks check:
    let index = 0;
    let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    siteConfig.Time.Range.forEach(time => {
        let correctIndex = index;
        let currentWeekday = `weekday-${days[index]}`;
        let weekdayButton = document.getElementById(currentWeekday);

        weekdayButton.onclick = (event) => {
            ChangeTimeElementTime(weekDayMinTime, time.StartHour, time.StartMinutes);
            ChangeTimeElementTime(weekDayMaxime, time.EndHour, time.EndMinutes);

            weekDayMinTime.onchange = function() {

                let time = weekDayMinTime.value;
                let hours = time.split(":")[0];
                let minutes = time.split(":")[1];

                siteConfig.Time.Range[correctIndex].StartHour = parseInt(hours, 10);
                siteConfig.Time.Range[correctIndex].StartMinutes = parseInt(minutes, 10);

            };
            weekDayMaxime.onchange = function() {
                let time = weekDayMaxime.value;
                let hours = time.split(":")[0];
                let minutes = time.split(":")[1];
                siteConfig.Time.Range[correctIndex].EndHour = parseInt(hours, 10);
                siteConfig.Time.Range[correctIndex].EndMinutes = parseInt(minutes, 10);
            };

            event.preventDefault();
        }

        index += 1;
    });

    // AllowOrBan
    banActiveChoice.value = siteConfig.AllowOrBan;
    banActiveChoice.addEventListener('change', () => {
        siteConfig.AllowOrBan = banActiveChoice.value;
    });
}

function ChangeTimeElementTime(element, hours, minutes) {
    // Change time values 
    let startHour = hours > 10 ? `${hours}` : `0${hours}`;
    let startMinutes = minutes > 10 ? `${minutes}` : `0${minutes}`;

    element.value = `${startHour}:${startMinutes}`;
}

function TransitionToMainPage() {
    $("#page1").show();
    $("#page2").hide();
}

function RemoveSite(siteConfiguration) {
    const index = window.sites.Sites.indexOf(siteConfiguration);
    if (index > -1) {
        window.sites.Sites.splice(index, 1); // 2nd parameter means remove one item only
    }

    let chilIndex = 0;
    let childrenLength = allSitesElement.children.length;

    for (let i = 0; i < childrenLength; i++) {
        let child = allSitesElement.children[i];
        if (child.innerHTML.includes(siteConfiguration.Url)) {
            chilIndex = i;
            break;
        }
    }

    allSitesElement.removeChild(allSitesElement.children[chilIndex]);
    allSitesElement.removeChild(allSitesElement.children[chilIndex - 1]);
    allSitesElement.removeChild(allSitesElement.children[chilIndex - 2]);
    chrome.storage.sync.set({ sites });
}

function CreateLIElement(siteConfig) {
    // SiteConfiguration
    let urlHost = siteConfig.Url;

    let buttonRemove = document.createElement("button");
    let trashIcon = document.createElement("i");
    trashIcon.classList.add("fa", "fa-solid", "fa-trash");
    buttonRemove.classList.add("button-red", "pure-button", "pure-u-1-24");
    buttonRemove.addEventListener('click', () => { RemoveSite(siteConfig); });
    buttonRemove.appendChild(trashIcon);

    let buttonMod = document.createElement("button");
    let cfgIcon = document.createElement("i");
    cfgIcon.classList.add("fa", "fa-cog");
    buttonMod.classList.add("button-blue", "pure-button", "pure-u-1-24");
    buttonMod.addEventListener('click', () => { transitionToModifyPage(siteConfig); });
    buttonMod.appendChild(cfgIcon);

    allSites.appendChild(buttonRemove);
    allSites.appendChild(buttonMod);

    let textDiv = document.createElement("div");
    textDiv.innerHTML = urlHost;
    allSites.appendChild(textDiv);
}

// Initialize the form with the user's option settings
chrome.storage.sync.get('sites', (data) => {
    window.sites = createSitesObject();

    console.log('sites');

    Object.assign(window.sites, data.sites);

    window.sites.Sites.forEach(siteConfig => {
        CreateLIElement(siteConfig);
    });
    isAppActiveCheckBox.checked = window.sites.IsWorking;
    if(!isAppActiveCheckBox.checked){
        hydrateImage.src = 'Images/PausedLogo.png';
    }
    

});

function addwebsite() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        let activeTab = tabs[0];

        let url = new URL(activeTab.url);
        const found = window.sites.Sites.find(element => element.Url == url.host);
        if (found !== undefined) {
            return;
        }

        let siteConfig = createSiteObject(url.host);

        window.sites.Sites.push(siteConfig);
        let sites = window.sites;

        chrome.storage.sync.set({ sites });

        CreateLIElement(siteConfig);
    });

}


/// On Working global config
function OnWorkingChecked(checked) {
    window.sites.IsWorking = checked;
    let sites = window.sites;
    chrome.storage.sync.set({ sites });

    if(checked){
        hydrateImage.src = 'Images/logoAnim.gif';
    }else{
        hydrateImage.src = 'Images/PausedLogo.png';
    }
}

isAppActiveCheckBox.addEventListener('change', function() {
    OnWorkingChecked(this.checked);
});


function clearAll() {
    console.log('clearing');
    chrome.storage.sync.clear();
}

siteConfigForm.addEventListener('submit', function() {
    SaveSites();
});