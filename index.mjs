import fs from 'fs';
import { parse } from 'csv-parse';
import yargs from 'yargs'

import { INVALID_PARAM_ERROR_MESSAGE, NO_MATCH_FOUND } from './utilities/utilities.mjs'

const { argv } = yargs(process.argv)

export function renderCookies(data) {
    if (!data.length) {
        logMessage(NO_MATCH_FOUND);
        return false;
    }
    data.map(item => logMessage(item.cookie));
    return true;
}

export function UTCToFormattedString(d) {
    return d.toISOString().slice(0, 10);
};

export function compareDateByParam(sourceDate, filterDate) {
    sourceDate = UTCToFormattedString(new Date(sourceDate));
    return sourceDate === filterDate;
}

export function filterActiveCookie(arrayList, filterItem) {
    return arrayList.filter(item => compareDateByParam(item.timestamp, filterItem));
}

function logMessage(message) {
    console.log(message);
}

async function readCSVfile(filePath) {
    let cookieList = [];

    const parser = fs
        .createReadStream(filePath)
        .on('error', (error) => logMessage(error))
        .pipe(parse({ delimiter: ',', columns: true }))

    for await (const record of parser) {
        cookieList.push(record);
    }
    return cookieList;
}


(async function init(params) {
    let csvPath = params.f;
    let filterParam = params.d;

    if ((!csvPath || csvPath === true) || (!filterParam || filterParam === true)) {
        logMessage(INVALID_PARAM_ERROR_MESSAGE);
        return;
    }

    const cookieList = await readCSVfile(csvPath);
    renderCookies(filterActiveCookie(cookieList, filterParam));

})(argv);