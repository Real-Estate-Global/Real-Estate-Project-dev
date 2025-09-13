const cities = require("./data/cities.json");

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
