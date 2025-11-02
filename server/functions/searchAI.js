const { GoogleGenAI } = require('@google/genai');
const { propertyTypes } = require('../constants');

const genAI = new GoogleGenAI({ apiKey: 'AIzaSyBNEYUjJfFSu1SINmeRjX4PxrW50ar2EDQ' }); // Replace with your API key

const SYSTEM_PROMPT = `
You are an assistant that extracts structured real estate search filters from user queries.
Given a search string, return a JSON object with the following fields:
{
    city: string | null,
    district: string | null,
    propertyType: ${propertyTypes.reduce((acc, type) => acc + `"${type}" | `, '')}null,
    budgetLowest: number | null,
    budgetHighest: number | null,
    areaLowest: number | null,
    areatHighest: number | null,
    floorLowest: number | null,
    floorHighest: number | null,
    yearOfBuildingLowest: number | null,
    yearOfBuildingHighest: number | null
}
If a value is not specified in the search string, set it to null. Only return the JSON object, nothing else.
Return results always in bulgarian language in this format, starting each word with a capital letter: "Горна Баня", "София".

If there isn't a specific city provided, try to guess which city is by the district defined or default to "София".
This is the prompt for the AI model:
`;

function parseJsonFromString(str) {
    const cleaned = str.replace(/^\s*```(?:json)?|```\s*$/g, '').trim();
    return JSON.parse(cleaned);
}

async function getFiltersFromSearchStringAI(searchString) {
    try {
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: SYSTEM_PROMPT + searchString,
        });
        const jsonText = result.candidates[0].content.parts[0].text;
        return parseJsonFromString(jsonText);
    } catch (error) {
        throw new Error('Failed to parse model response as JSON', error);
    }
}

const getSelectedFiltersAI = async (req, res) => {
    try {
        const searchString = req.query.searchString;
        const filters = await getFiltersFromSearchStringAI(searchString);
        res.status(200).json({
            filters,
        });
    } catch (error) {
        res
            .status(500)
            .json({ error: "Something went wrong while fetching the searchData" });
    }
};

module.exports = { getSelectedFiltersAI };
