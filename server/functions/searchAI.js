const { GoogleGenAI, Type } = require('@google/genai');

const genAI = new GoogleGenAI({ apiKey: 'AIzaSyBNEYUjJfFSu1SINmeRjX4PxrW50ar2EDQ' }); // Replace with your API key

const SYSTEM_PROMPT = `
You are an assistant that extracts structured real estate search filters from user queries.
Given a search string, return a JSON object with the following fields:
{
    city: string or null,
    district: string or null,
    propertyType: string or null,
    budgetLowest: number or null,
    budgetHighest: number or null,
    areaLowest: number or null,
    areatHighest: number or null,
    floorLowest: number or null,
    floorHighest: number or null,
    roomsLowest: number or null,
    roomsHighest: number or null,
    yearOfBuildingLowest: number or null,
    yearOfBuildingHighest: number or null
}
If a value is not specified in the search string, set it to null. Only return the JSON object, nothing else.
Return results always in bulgarian language in this format, starting each word with a capital letter: "Горна Баня", "София".

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

const getSelectedFitlersAI = async (req, res) => {
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

module.exports = { getSelectedFitlersAI };
