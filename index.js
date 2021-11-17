const csv = require('csv-parser');
const fs = require('fs');

let cookieList = [];
const inputFilePathPrefix = '-f';
const inputDatePrefix = '-d';
const INVALID_PATH_ERROR_MESSAGE = "Invalid file path, Please parse a valid file Path (Ex: `node index -f cookie_log.csv` )";
const INVALID_PARAM_ERROR_MESSAGE = "Pleae parse a valid CSV file path and filter date.(Ex: `node index -f cookie_log.csv -d 2018-12-09` )";
const NO_MATCH_FOUND = "No Record found for the given date.";

function renderCookies(data) {
    if (!data.length) {
        logMessage(NO_MATCH_FOUND);
    }
    data.map(item => logMessage(item.cookie));
}

function UTCToFormattedString(d) {
    return d.toISOString().slice(0, 10);
};

function compareDateByParam(sourceDate, filterDate) {
    sourceDate = UTCToFormattedString(new Date(sourceDate));
    return sourceDate === filterDate;
}

function filterActiveCookie(arrayList, filterItem) {
    return arrayList.filter(item => compareDateByParam(item.timestamp, filterItem));
}

function addCookieItem(data) {
    return cookieList.push(data);
}

function getCookieList() {
    return cookieList;
}

function logMessage(message) {
    console.log(message);
}

function readCSVfile(filePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .on('error', (error) => reject(error))
            .pipe(csv())
            .on('data', (data) => addCookieItem(data))
            .on('end', () => {
                resolve(getCookieList());
            });
    });
}

function parseAndRenderActiveCookieList(cookieData, filterParam) {
    renderCookies(filterActiveCookie(cookieData, filterParam));
}

(function init(params) {
    const paths = params.slice(2);
    let csvPath = null;
    let filterParam = null;

    if ((paths[0] !== inputFilePathPrefix) || !paths[1]) {
        logMessage(INVALID_PATH_ERROR_MESSAGE);
        return;
    }
    csvPath = paths[1];

    if ((paths[2] !== inputDatePrefix) || !paths[3]) {
        logMessage(INVALID_PARAM_ERROR_MESSAGE);
        return;
    }
    filterParam = paths[3];

    readCSVfile(csvPath)
        .then(cookieList => {
            parseAndRenderActiveCookieList(cookieList, filterParam);
        }).catch(error => {
            logMessage(error);
        });

})(process.argv);