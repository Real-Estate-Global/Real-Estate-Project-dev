import { getMyOffer } from "../services/collections"
import { useState, useEffect, useContext } from "react"
import { useParams } from 'react-router-dom'
import AuthContext from "../contexts/authContext"
import OfferDetails from "./OfferDetails/OfferDetails"

export default function MyOfferPage() {
    const { isAuthenticated, token } = useContext(AuthContext)

    const { _id } = useParams()
    const [myProperty, setMyProperty] = useState(null)

    useEffect(() => {
        // loader
        // error
        if (isAuthenticated && !myProperty) {
            getMyOffer(_id, token)
                .then(result => setMyProperty({ ...result }))
        }
    }, [isAuthenticated, myProperty])

    return (
        <OfferDetails propertyDetails={myProperty} isLoading={false}/>
    )
}
