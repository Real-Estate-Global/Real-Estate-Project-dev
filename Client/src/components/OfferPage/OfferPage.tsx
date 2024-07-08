import {getOneProperty} from "../../services/propertyService"
import {useState, useEffect} from "react"
import {useParams} from 'react-router-dom'
import OfferDetails from "../OfferDetails/OfferDetails"
import styles from "./OfferPage.module.css"

export default function OfferPage() {
    const {offerId} = useParams()
    const [property, setProperty] = useState({})

    useEffect(() => {
        getOneProperty(offerId)
            .then(result => setProperty({...result}))
    }, [offerId])

    return (
        <div className={styles["offer-wrapper"]}>
            <OfferDetails propertyDetails={property} isLoading={false}/>
        </div>
    )
}
