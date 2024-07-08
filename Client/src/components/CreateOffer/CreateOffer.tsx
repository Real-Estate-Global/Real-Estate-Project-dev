import useForm from "../../hooks/useForm"
import { useContext } from "react"
import AuthContext from "../../contexts/authContext"
import Button from "react-bootstrap/esm/Button"
import Card from "react-bootstrap/Card"
import cities from '../../locations'
import { onlyUnique } from "../../utils"
import styles from "./CreateOffer.module.css"
import LoaderContext from "../../contexts/loaderContext"
import { addNewOffer } from "../../services/collections"
import { useNavigate } from "react-router-dom"
import Path from "../../paths"
import ErrorContext from "../../contexts/errorContext"

const CreateOfferFormKeys = {
    PropertyType: 'propertyType',
    Location: 'location',
    District: 'district',
    Rooms: 'rooms',
    Floor: 'floor',
    Price: 'price',
    Currency: 'currency',
    Area: 'area',
    YearOfBuilding: 'yearOfBuilding',
    Description: 'description',
}

export default function CreateOffer() {
    const { token } = useContext(AuthContext)
    const { setLoading } = useContext(LoaderContext)
    const { setError } = useContext(ErrorContext)
    const navigate = useNavigate()
    const addNewOfferHandler = async (values) => {
        try {
            setLoading({ isLoading: true })
            await addNewOffer(values, token)
                .then(navigate(Path.MyOffers))
        } catch (e) {
            setError({ hasError: true, message: e.message })
        } finally {
            setLoading({ isLoading: false })
        }
    }

    const { values, onChange, onSubmit } = useForm(addNewOfferHandler, {
        [CreateOfferFormKeys.PropertyType]: 'Апартамент',
        [CreateOfferFormKeys.Location]: '',
        [CreateOfferFormKeys.District]: '',
        [CreateOfferFormKeys.Rooms]: '',
        [CreateOfferFormKeys.Floor]: '',
        [CreateOfferFormKeys.Price]: '',
        [CreateOfferFormKeys.Currency]: '',
        [CreateOfferFormKeys.Area]: '',
        [CreateOfferFormKeys.YearOfBuilding]: '',
        [CreateOfferFormKeys.Description]: '',
    })

    return (
        <div className={styles["create-offer-page"]}>
            <h1>Създай нова оферта</h1>
            <Card className={styles['add-new-offer-wrapper']}>
                <form className={styles["add-new-offer-form"]} onSubmit={onSubmit} action="">
                    <div>
                        <label htmlFor="propertyType">Тип на имота:</label>
                        <select id="propertyType" name="propertyType" required onChange={onChange}>
                            <option value="Апартамент">Апартамент</option>
                            <option value="Къща">Къща</option>
                            <option value="Парцел">Парцел</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location">Град:</label>
                        <select id="location" name="location" required onChange={onChange}>
                            <option value={null} selected hidden>Град</option>
                            {cities.map((city) => (city.City)).filter(onlyUnique).map(location =>
                                <option key={location} value={location}>{location}</option>)}

                        </select>
                    </div>
                    <div>
                        <label htmlFor="district">Квартал:</label>
                        <select id="district" name="district" disabled={!values[CreateOfferFormKeys.Location]} onChange={onChange}>
                            <option value={null} selected hidden>Квартал</option>
                            {cities.filter(city => city.City === values[CreateOfferFormKeys.Location]).map((location) => (location.District)).map(district =>
                                <option key={district} value={district}>{district}</option>)}

                        </select>
                    </div>
                    <div>
                        <label htmlFor="rooms" >Стаи:</label>
                        <input
                            required
                            type="number"
                            id="rooms"
                            name="rooms"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.Rooms]}
                            min={1}
                        />
                    </div>
                    <div>
                        <label htmlFor="floor">Етаж:</label>
                        <input
                            required
                            type="number"
                            id="floor"
                            name="floor"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.Floor]}
                            min={-3}
                            max={100}
                        />
                    </div>
                    <div>
                        <label htmlFor="price">Цена:</label>
                        <input
                            required
                            type="number"
                            id="price"
                            name="price"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.Price]}
                            min={0}
                        />
                    </div>
                    <div>
                        <label htmlFor="currency">Валута:</label>
                        <input
                            required
                            type="text"
                            id="currency"
                            name="currency"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.Currency]}
                        />
                    </div>
                    <div>
                        <label htmlFor="area">Площ:</label>
                        <input
                            required
                            type="number"
                            id="area"
                            name="area"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.Area]}
                            min={1}
                        />
                    </div>
                    <div>
                        <label htmlFor="yearOfBuilding">Година на строителство:</label>
                        <input
                            required
                            type="number"
                            id="yearOfBuilding"
                            name="yearOfBuilding"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.YearOfBuilding]}
                            min={1900}
                            max={2030}
                        />
                    </div>
                    <div>  <label htmlFor="description">Описание:</label>
                        <textarea
                            required
                            type="text"
                            id="description"
                            name="description"
                            onChange={onChange}
                            value={values[CreateOfferFormKeys.Description]}
                            minLength={100}
                            maxLength={1200}
                        />
                    </div>
                    <Button
                        type="submit" value="Submit">Създай обява
                    </Button>
                </form>
            </Card>
        </div>

    )
}
