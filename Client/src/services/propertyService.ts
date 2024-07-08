const baseUrl = "http://localhost:3000/data"

const buildFiltersQuery = (filters) => {
    if (!filters) {
        return ''
    }
    let filtersQuery = '?'

    if (filters.city) {
        filtersQuery += `location=${filters.city}`
    }
    if (filters.district) {
        filtersQuery += `district=${filters.district}`
    }

    return filtersQuery
}
const filterProperties = (filters, properties) => {
    return properties.filter(property => {
        if (filters.budgetLowest) {
            if (property.price < filters.budgetLowest) {
                return false
            }
        }

        if (filters.budgetHighest) {
            if (property.price > filters.budgetHighest) {
                return false
            }
        }

        return true
    })
}
export const getProperties = async (filters) => {
    const response = await fetch(`${baseUrl}/offers${buildFiltersQuery(filters)}`)
    if (!response.ok) {
        throw await response.json()
    }
    const properties = await response.json()

    if (filters) {
        return filterProperties(filters, properties)
    }
    return properties
};

export async function getOneProperty(id) {
    const response = await fetch(`${baseUrl}/offers/${id}`);
    if (!response.ok) {
        throw await response.json()
    }
    return await response.json();
}
