const cities = require("./cities.json");

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

const getFilterByKeyWord = ({ keyWords, matches }) => {
  return keyWords.reduce((acc, word) => {
    for (const match of matches) {
      if (word.toLowerCase().includes(match.toLowerCase())) {
        return match;
      }
    }
    return acc;
  }, null);
};

const getSelectedFitlersByKSearchString = (searchString) => {
  const parsedCities = cities;
  const citiesOnly = parsedCities.map((city) => city.City);
  const districtsOnly = parsedCities.map((city) => city.District);

  const keyWords = searchString.split(/\s+/);
  const filters = {
    city: getFilterByKeyWord({ keyWords, matches: citiesOnly }),
    district: getFilterByKeyWord({ keyWords, matches: districtsOnly }),
    propertyType: getFilterByKeyWord({ keyWords, matches: [] }),
    budgetLowest: null,
    budgetHighest: null,
    areatLowest: null,
    areatHighest: null,
    floorLowest: null,
    floorHighest: null,
    roomsLowest: null,
    roomsHighest: null,
    yearOfBuildingLowest: null,
    yearOfBuildingHighest: null,
  };

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
