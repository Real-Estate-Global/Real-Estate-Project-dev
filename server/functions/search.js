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
const parseRoomsFromSearchString = (searchString) => {
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

const parseFloorFromSearchString = (searchString) => {
  if (!searchString || typeof searchString !== "string") {
    return { floorLowest: null, floorHighest: null };
  }

  // Bulgarian ordinal numbers from 1 to 100
  const bgOrdinals = [
    "първи", "втори", "трети", "четвърти", "пети", "шести", "седми", "осми", "девети", "десети",
    "единадесети", "дванадесети", "тринадесети", "четиринадесети", "петнадесети", "шестнадесети", "седемнадесети", "осемнадесети", "деветнадесети", "двадесети",
    "двадесет и първи", "двадесет и втори", "двадесет и трети", "двадесет и четвърти", "двадесет и пети", "двадесет и шести", "двадесет и седми", "двадесет и осми", "двадесет и девети", "тридесети",
    "тридесет и първи", "тридесет и втори", "тридесет и трети", "тридесет и четвърти", "тридесет и пети", "тридесет и шести", "тридесет и седми", "тридесет и осми", "тридесет и девети", "четиридесети",
    "четиридесет и първи", "четиридесет и втори", "четиридесет и трети", "четиридесет и четвърти", "четиридесет и пети", "четиридесет и шести", "четиридесет и седми", "четиридесет и осми", "четиридесет и девети", "петдесети",
    "петдесет и първи", "петдесет и втори", "петдесет и трети", "петдесет и четвърти", "петдесет и пети", "петдесет и шести", "петдесет и седми", "петдесет и осми", "петдесет и девети", "шестдесети",
    "шестдесет и първи", "шестдесет и втори", "шестдесет и трети", "шестдесет и четвърти", "шестдесет и пети", "шестдесет и шести", "шестдесет и седми", "шестдесет и осми", "шестдесет и девети", "седемдесети",
    "седемдесет и първи", "седемдесет и втори", "седемдесет и трети", "седемдесет и четвърти", "седемдесет и пети", "седемдесет и шести", "седемдесет и седми", "седемдесет и осми", "седемдесет и девети", "осемдесети",
    "осемдесет и първи", "осемдесет и втори", "осемдесет и трети", "осемдесет и четвърти", "осемдесет и пети", "осемдесет и шести", "осемдесет и седми", "осемдесет и осми", "осемдесет и девети", "деветдесети",
    "деветдесет и първи", "деветдесет и втори", "деветдесет и трети", "деветдесет и четвърти", "деветдесет и пети", "деветдесет и шести", "деветдесет и седми", "деветдесет и осми", "деветдесет и девети", "стотен"
  ];

  // Map ordinals to numbers
  const ordinalToNumber = {};
  bgOrdinals.forEach((word, idx) => {
    ordinalToNumber[word] = idx + 1;
  });

  // Also support short forms: 1ви, 1-ви, 99ти, 99-ти, 100тен, etc.
  function parseOrdinal(str) {
    str = str.trim().toLowerCase();
    if (ordinalToNumber[str]) return ordinalToNumber[str];
    // Match short forms: 1ви, 1-ви, 99ти, 99-ти, 100тен, etc.
    const shortForm = str.match(/^(\d{1,3})\s*-?\s*(ви|ти|ри|ти|тен|вен|ти)$/);
    if (shortForm) {
      const num = parseInt(shortForm[1], 10);
      if (num >= 1 && num <= 100) return num;
    }
    // Match just a number
    const justNum = str.match(/^(\d{1,3})$/);
    if (justNum) {
      const num = parseInt(justNum[1], 10);
      if (num >= 1 && num <= 100) return num;
    }
    // Try to match full written ordinal
    for (const [word, num] of Object.entries(ordinalToNumber)) {
      if (str === word) return num;
    }
    return null;
  }

  // Helper to extract all possible floor numbers from a string
  function extractFloors(str) {
    const results = [];
    // Match all short forms and numbers
    const regex = /(\d{1,3})\s*-?\s*(ви|ти|ри|ти|тен|вен|ти)?/g;
    let match;
    while ((match = regex.exec(str)) !== null) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= 100) results.push(num);
    }
    // Match all written ordinals
    for (const [word, num] of Object.entries(ordinalToNumber)) {
      if (str.includes(word)) results.push(num);
    }
    return results;
  }

  // Normalize string
  const normalized = searchString.toLowerCase();

  // 1. Range: "от 5ти до 10ти етаж", "5 до 10 етаж", "между 5ти и 10ти етаж", "5ти-10ти етаж"
  let rangeRegexes = [
    /от\s+([^\s]+)\s*(?:-|до|и)\s*([^\s]+)\s*етаж/gi,
    /между\s+([^\s]+)\s*(?:-|и|до)\s*([^\s]+)\s*етаж/gi,
    /(\d{1,3}|[а-я\s]+)\s*(?:-|до|и)\s*(\d{1,3}|[а-я\s]+)\s*етаж/gi,
    /(\d{1,3}|[а-я\s]+)\s*(?:-|до|и)\s*(\d{1,3}|[а-я\s]+)\s*етаж[а-я]*/gi
  ];
  for (const regex of rangeRegexes) {
    const match = regex.exec(normalized);
    if (match && match[1] && match[2]) {
      const low = parseOrdinal(match[1]);
      const high = parseOrdinal(match[2]);
      if (low && high) {
        return {
          floorLowest: Math.min(low, high),
          floorHighest: Math.max(low, high)
        };
      }
    }
  }

  // 2. "до 5ти етаж" (up to 5)
  let upToRegex = /до\s+([^\s]+)\s*етаж/gi;
  let upToMatch = upToRegex.exec(normalized);
  if (upToMatch && upToMatch[1]) {
    const high = parseOrdinal(upToMatch[1]);
    if (high) {
      return { floorLowest: 1, floorHighest: high };
    }
  }

  // 3. "от 5ти етаж" (from 5)
  let fromRegex = /от\s+([^\s]+)\s*етаж/gi;
  let fromMatch = fromRegex.exec(normalized);
  if (fromMatch && fromMatch[1]) {
    const low = parseOrdinal(fromMatch[1]);
    if (low) {
      return { floorLowest: low, floorHighest: 100 };
    }
  }

  // 4. Single: "5ти етаж", "пети етаж", "5 етаж", "5-ти етаж"
  let singleRegex = /([^\s]+)\s*етаж/gi;
  let singleMatch = singleRegex.exec(normalized);
  if (singleMatch && singleMatch[1]) {
    const num = parseOrdinal(singleMatch[1]);
    if (num) {
      return { floorLowest: num, floorHighest: num };
    }
  }

  // 5. Only "етаж" with numbers elsewhere
  const allFloors = extractFloors(normalized);
  if (allFloors.length === 1) {
    return { floorLowest: allFloors[0], floorHighest: allFloors[0] };
  }
  if (allFloors.length > 1) {
    return {
      floorLowest: Math.min(...allFloors),
      floorHighest: Math.max(...allFloors)
    };
  }

  return { floorLowest: null, floorHighest: null };
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
      ...parseRoomsFromSearchString(searchString),
      ...parseFloorFromSearchString(searchString),
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
