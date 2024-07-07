import {useState, useEffect, useContext} from "react"
import {getMyOffers} from "../../services/collections"
import OfferCard from "../OfferCard/OfferCard"
import {Link} from "react-router-dom"
import AuthContext from "../../contexts/authContext"
import Button from "react-bootstrap/esm/Button"
import styles from './MyOffers.module.css'
import ConfirmPopup from '../ConfirmPopup'
import {deleteOffer} from "../../services/collections"

export default function MyOffers() {
    const [confirmPopupState, setConfirmPopupState] = useState({show: false, id: null})
    const {isAuthenticated, token} = useContext(AuthContext)
    const [myProperties, setMyProperties] = useState()

    const fetchOffers = () => {
        getMyOffers(token)
            .then(result => setMyProperties(result))
    }

    useEffect(() => {
        try {
            if (isAuthenticated && !myProperties) {
                fetchOffers()
            }
        } catch (e) {
            console.error(e)
        }
    }, [isAuthenticated, myProperties])

    const onConfirmDelete = async () => {
        try {
            await deleteOffer(confirmPopupState.id, token)
            await fetchOffers()
        } catch (error) {
            console.log(error)
        }
        setConfirmPopupState({show: false, id: null})
    }

    const onCancelPopup = () => {
        setConfirmPopupState({show: false, id: null})
    }

    if (!isAuthenticated) {
        return <div> Login please </div>
    }

    return (
        <div className={styles["my-offers-list-wrapper"]}>
            <ConfirmPopup
                show={confirmPopupState.show}
                text="Iskate li triete obqva molia??"
                onConfirm={onConfirmDelete}
                onCancel={onCancelPopup}
            />
            <h1 className={styles["my-offers-title"]}>Моите обяви</h1>
            <Button><Link className={styles["add-offer-link"]} to='/createoffer'>Добави обява</Link></Button>
            <div className={styles["my-offers-list"]}>
                {myProperties && myProperties.map((property) => (
                    <OfferCard key={property._id} property={property} editEnabled={true}
                               setConfirmPopupState={setConfirmPopupState}/>
                ))}
            </div>
        </div>
    )
}
