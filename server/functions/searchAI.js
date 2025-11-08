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
    // First, try to find JSON-like content between backticks
    const backtickMatch = str.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
    if (backtickMatch) {
        return JSON.parse(backtickMatch[1].trim());
    }

    // If no backticks, try to find the first occurrence of a JSON object
    const objectMatch = str.match(/{[\s\S]*?}/);
    if (objectMatch) {
        return JSON.parse(objectMatch[0].trim());
    }

    // If still no match, clean up the string and try to parse
    const cleaned = str.replace(/^\s*```(?:json)?|```\s*$/g, '').trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        return JSON.parse(cleaned);
    }

    throw new Error('Could not find valid JSON in the response');
}

async function getFiltersFromSearchStringAI(searchString) {
    try {
        console.log('searchString:', searchString);
        const result = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nUser query: " + searchString }]
                }
            ]
        });
        console.log('AI model raw response:', JSON.stringify(result, null, 2));
        
        if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Unexpected API response structure');
        }

        const jsonText = result.candidates[0].content.parts[0].text;
        console.log('Raw JSON text from AI:', jsonText);
        
        try {
            // Try direct parsing first
            return JSON.parse(jsonText);
        } catch (parseError) {
            console.log('Direct parsing failed, trying cleanup:', parseError);
            // If direct parsing fails, try the cleanup method
            return parseJsonFromString(jsonText);
        }
    } catch (error) {
        console.error('Full error details:', error);
        throw new Error(`Failed to parse model response as JSON: ${error.message}`);
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
        console.error('Error fetching search data:', error);
        res
            .status(500)
            .json({ error: "Something went wrong while fetching the searchData" });
    }
};

module.exports = { getSelectedFiltersAI };
