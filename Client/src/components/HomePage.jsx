import HomeOffersList from './HomeOffersList/HomeOffersList'
import HeadingImage from './HeadingImage'
import SearchForm from './SearchForm'
import LoaderContext from '../contexts/loaderContext'
import { getProperties } from '../services/propertyService'
import ErrorContext from '../contexts/errorContext'
import { useState, useContext } from 'react'


export default function HomePage() {
    const [properties, setProperties] = useState([])
    const {setLoading} = useContext(LoaderContext)
    const {setError} = useContext(ErrorContext)

    const getHomeOfferList = async (filters) => {
        try {
            setLoading({ isLoading: true })
            getProperties(filters)
                .then(result => setProperties(result))

        } catch (e) {
            setError({ hasError: true, message: e.message })
        } finally {
            setLoading({ isLoading: false })
        }
    }

    return (
        <>
            <HeadingImage />
            <SearchForm getHomeOfferList={getHomeOfferList} />
            <HomeOffersList properties={properties} getProperties={getHomeOfferList} />
        </>
    )
}
