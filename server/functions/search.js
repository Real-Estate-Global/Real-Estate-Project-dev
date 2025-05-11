const cities = require("./data/cities.json");
const propertyTypes = require("./data/propertyTypes.json");

const getSearchData = async (req, res) => {
  try {
    res.status(200).json({
      cities,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching the searchData" });
  }
};

const getFiltersKeyWords = ({ searchString, matches }) => {
  for (const match of matches) {
    if (searchString.toLowerCase().includes(match.toLowerCase())) {
      return match;
    }
  }
};
const parseFloorFromSearchString = (searchString) => {
  if (!searchString || typeof searchString !== "string") {
    return { floorLowest: null, floorHighest: null };
  }

  const wordToNumberMapping = {
    "една": 1,
    "две": 2,
    "три": 3,
    "четири": 4,
    "пет": 5,
  };

  const rangeRegex = /(\d+|една|две|три|четири|пет)\s*(?:до|или)\s*(\d+|една|две|три|четири|пет)\s*стаи/;
  const singleRegex = /(\d+|една|две|три|четири|пет)\s*стаи?/;
  const exactMatchRegex = /(една стая|едностаен|двустаен|тристаен|четиристаен|петстаен)(?:\s*или\s*(една стая|едностаен|двустаен|тристаен|четиристаен|петстаен))?/;

  const rangeMatch = searchString.match(rangeRegex);
  if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
    const lowest = isNaN(rangeMatch[1]) ? wordToNumberMapping[rangeMatch[1]] : parseInt(rangeMatch[1], 10);
    const highest = isNaN(rangeMatch[2]) ? wordToNumberMapping[rangeMatch[2]] : parseInt(rangeMatch[2], 10);
    return { roomsLowest: lowest, roomsHighest: highest };
  }

  const singleMatch = searchString.match(singleRegex);
  if (singleMatch && singleMatch[1]) {
    const value = isNaN(singleMatch[1]) ? wordToNumberMapping[singleMatch[1]] : parseInt(singleMatch[1], 10);
    return { roomsLowest: value, roomsHighest: value };
  }

  const exactMatch = searchString.match(exactMatchRegex);
  if (exactMatch && exactMatch[1]) {
    const mapping = {
      "една стая": 1,
      "едностаен": 1,
      "двустаен": 2,
      "тристаен": 3,
      "четиристаен": 4,
      "петстаен": 5,
    };
    const value1 = mapping[exactMatch[1]];
    const value2 = exactMatch[2] ? mapping[exactMatch[2]] : value1;
    return { roomsLowest: Math.min(value1, value2), roomsHighest: Math.max(value1, value2) };
  }

  return { roomsLowest: null, roomsHighest: null };
};

const getSelectedFitlersByKSearchString = (searchString) => {
  const parsedCities = cities;
  const citiesOnly = parsedCities.map((city) => city.City);
  const districtsOnly = parsedCities.map((city) => city.District);

  const getFiltersFromSearchString = (searchString) => {
    return {
      city: getFiltersKeyWords({ searchString, matches: citiesOnly }),
      district: getFiltersKeyWords({ searchString, matches: districtsOnly }),
      propertyType: getFiltersKeyWords({ searchString, matches: propertyTypes }),
      budgetLowest: null,
      budgetHighest: null,
      areatLowest: null,
      areatHighest: null,
      ...parseFloorFromSearchString(searchString),
      floorLowest: null,
      floorHighest: null,
      yearOfBuildingLowest: null,
      yearOfBuildingHighest: null,
    };
  };

  const filters = getFiltersFromSearchString(searchString);

  return filters;
};

const getSelectedFitlers = async (req, res) => {
  try {
    const searchString = req.query.searchString;
    const filters = getSelectedFitlersByKSearchString(searchString);

    res.status(200).json({
      filters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching the searchData" });
  }
};

module.exports = {
  getSearchData,
  getSelectedFitlers,
};
