class Category {
    constructor() {
        this.Name = '';
        
    }
}

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
    constructor(startHour, startMinutes, endHour, endMinutes, day) {
        this.StartHour = startHour;
        this.StartMinutes = startMinutes;
        this.EndHour = endHour;
        this.EndMinutes = endMinutes;
        this.Day = day;
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

    let nowHour = now.getHours();
    let nowMinutes = now.getMinutes();

    console.log(`Now Hour : ${nowHour}, Minutes: ${nowMinutes}`);

    let isHourBanned = (nowHour > minHour && nowHour < maxHour);
    let isMinutesBanned = (nowMinutes > minMinutes && nowMinutes < maxMinutes);

    console.log(`Is Hour Banned? ${isHourBanned}, is Minute? ${isMinutesBanned}`);
    let isBanActive = site.BanPermanent || isHourBanned;

    if (site.BanPermanent) {
        isBanActive = true;
    } else if (isHourBanned) {
        isBanActive = isBanActive || isMinutesBanned;
    } else if (nowHour == minHour || nowHour == maxHour) {
        isBanActive = isMinutesBanned;
    }

    console.log(isBanActive);

    if (site.AllowOrBan === 'ban' || site.AllowOrBan === 'Ban') {
        return isBanActive;
    } else {
        return !isBanActive;
    }

}

function createSitesObject() {
    return new SitesConfiguration();
}

function createSiteObject(host) {
    return new SiteConfiguration(host);
}