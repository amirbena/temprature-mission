const fs = require('fs');
const { StatusCodes } = require('http-status-codes')

const allCities = require('../../weather_16.json');
const blockedCitiesPath = './blockedCities.json'

let blockedCities = require("../../blockedCities.json");


const isSameDate = (date1, date2) => date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()

const disableCityToUsers = async name => {
    const isFound = allCities.find(({ city: { name: city }, }) => city === name);
    if (!isFound) return false;
    blockedCities.push(name);
    console.log(blockedCities);
    await writeNewBlockedCityToFile();

    return true;
}

const enableCityToUsers = async name => {
    const lengthBefore = blockedCities.length;
    blockedCities = blockedCities.filter(blockedCity => blockedCity !== name);
    if (lengthBefore === blockedCities.length) return false;
    await writeNewBlockedCityToFile();
    return true
}

const writeNewBlockedCityToFile = async () => {
    try {
        const blockedCitiesStringify = JSON.stringify(blockedCities);
        await writeFileAsync(blockedCitiesPath, blockedCitiesStringify);
    } catch (ex) {
        console.log(ex.message);
        throw ex;
    }

}
const writeFileAsync = (filePath, content) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, { encoding: "utf8" }, (err, result) => {
            console.log(err, result)
            if (err) return reject(err);
            console.log(result);
            resolve();
        })
    })

}

const searchByDateAndCity = (req, res) => {
    const { city } = req.params;
    const { date } = req.body;
    try {
        const isNotAllowedSearch = blockedCities.find(blockedCity => blockedCity === city);
        if (isNotAllowedSearch) return res.status(StatusCodes.FORBIDDEN).send("This is blocked city, can't search that");
        const searchTempature = allCities.find(({ city: { name }, time }) => {
            const dateChecked = new Date(time);
            return name === city && isSameDate(date, dateChecked);
        })
        if (!searchTempature) return res.status(StatusCodes.NOT_FOUND).send("No result found according this details");
        return res.json({ searchTempature });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Internal Error, reason :${error.message}`);
    }
}

const changeCityType = async (req, res) => {
    const { type, city } = req.body;
    try {
        let result;
        if (type === "disable") {
            result = await disableCityToUsers(city);
            if (!result) return res.status(StatusCodes.NOT_FOUND).send("city not found");
            return res.send(`City ${city} is blocked from searched cities`)
        }
        result = await enableCityToUsers(city);
        if (!result) return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("city has already enabled");
        return res.send(`City ${city} is enabled to searched cities`)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Internal Error, reason :${error.message}`);
    }
}


module.exports = {
    searchByDateAndCity,
    changeCityType
}