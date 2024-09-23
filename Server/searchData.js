const cities = [
  {
    City: "София",
    District: "Абдовица",
  },
  {
    City: "София",
    District: "Горна баня",
  },
  {
    City: "София",
    District: "Малинова долина",
  },
  {
    City: "София",
    District: "Драгалевци",
  },
  {
    City: "София",
    District: "Витоша",
  },
  {
    City: "Пловдив",
    District: "Тракия",
  },
  {
    City: "Пловдив",
    District: "Смирненски",
  },
  {
    City: "Пловдив",
    District: "Съдийски",
  },
  {
    City: "Пловдив",
    District: "Център",
  },
  {
    City: "Варна",
    District: "Аспарухово",
  },
  {
    City: "Варна",
    District: "Розова долина",
  },
  {
    City: "Варна",
    District: "Зеленика",
  },
];

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

module.exports = {
  getSearchData,
};
