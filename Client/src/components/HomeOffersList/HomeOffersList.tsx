import {useEffect} from "react"
import OfferCard from "../OfferCard/OfferCard"
import styles from './HomeOffersList.module.css'

export default function HomeOffersList({properties, getProperties}) {
    useEffect(() => {
        getProperties()
    }, [])

    return (
        <>
            <h1 className={styles["offer-list-title"]}>Последни оферти</h1>
            <div className={styles["offer-list-wrapper"]}>
                <div className={styles["best-offers-list"]}>
                    {[properties.map((property) => (
                        <OfferCard key={property._id} property={property} editEnabled={false}/>)
                    )]}
                </div>
            </div>
        </>
    )
}
