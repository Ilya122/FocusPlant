class SitesConfiguration {
    constructor() {
        this.Sites = []; // SiteConfiguration
        this.IsWorking = true;
    }
}

// Describes a single site configuration
class SiteConfiguration {
    constructor(url) {
        this.Url = url;
        this.AllowOrBan = 'ban'; //ban or active
        this.BanPermanent = false; // Default, if to ban it all week.
        // List of ban/active hours, type of BanTime
        this.Time = new BanTime();

        for (let i = 0; i < 7; i++) {
            this.Time.Range.push(new HourRange(0, 0, 23, 59, i, true));
        }
        this.DailyTime = new HourRange(0, 0, 23, 59 - 1);
    }
}

// Describe banning hours
class BanTime {
    constructor() {
        this.Range = [];
    }
    Add(hourRange) {
        this.Range.push(hourRange);
    }
}

// Time marked as 00 - 24 format
// Day is marked from 0-6, 0 is sunday.
class HourRange {
    constructor(startHour, startMinutes, endHour, endMinutes, day, isActive = true) {
        this.StartHour = startHour;
        this.StartMinutes = startMinutes;
        this.EndHour = endHour;
        this.EndMinutes = endMinutes;
        this.Day = day;
        this.IsActive = isActive;
    }
}

const readLocalStorage = async(key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(result) {
            if (result[key] === undefined) {
                resolve(undefined);
            } else {
                resolve(result[key]);
            }
        });
    });
};

async function GetSites() {
    return await readLocalStorage('sites');
}

function isBanned(site) {
    let now = new Date();
    let dayConfig = site.Time.Range[now.getDay()];
    console.log("-------");
    console.log(dayConfig);
    console.log(now);
    console.log("-------");

    let minHour = dayConfig.StartHour;
    let minMinutes = dayConfig.StartMinutes;
    let maxHour = dayConfig.EndHour;
    let maxMinutes = dayConfig.EndMinutes;

    console.log(`Now Hour : ${now.getHours()}, Minutes: ${now.getMinutes()}`);
    console.log(`Is active in day? ${dayConfig.IsActive}`);
    if (!dayConfig.IsActive) {
        return;
    }

    let isActiveBan = site.BanPermanent ||
        ((now.getHours() >= minHour && now.getHours() <= maxHour) &&
            (now.getMinutes() >= minMinutes && now.getMinutes() <= maxMinutes));

    console.log(isActiveBan);
    if (site.AllowOrBan === 'ban') {
        return isActiveBan;
    } else {
        return !isActiveBan;
    }

}

function createSitesObject() {
    return new SitesConfiguration();
}

function createSiteObject(host) {
    return new SiteConfiguration(host);
}