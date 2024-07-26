import useForm from "../../hooks/useForm";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
import cities from "../../locations";
import { onlyUnique } from "../../utils";
import styles from "./CreateOffer.module.css";
import { useNavigate } from "react-router-dom";
import { Path } from "../../paths";
import { useAppDispatch } from "../../store/hooks";
import { useCallback } from "react";
import { loadingSliceActions } from "../../store/slices/loading";
import { errorSliceActions } from "../../store/slices/error";
import { ErrorType } from "../../types/ErrorType";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";
import { useAddNewOfferMutation } from "../../store/api/privateOffers";

export const CreateOffer = () => {
  const [addNewOffer] = useAddNewOfferMutation();
  const dispatch = useAppDispatch();

  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(loadingSliceActions.setLoading(isLoading));
    },
    [dispatch]
  );
  const setError = useCallback(
    (error: ErrorType) => {
      dispatch(errorSliceActions.setError(error));
    },
    [dispatch]
  );
  const navigate = useNavigate();
  const addNewOfferHandler = async (values: OfferType) => {
    try {
      setLoading(true);
      await addNewOffer(values)
        .then(navigate(Path.MyOffers) as any)
        .finally(() => {
          setLoading(false);
        });
    } catch (e: any) {
      setError({ hasError: true, message: e.message });
    }
  };

  const { values, onChange, onSubmit } = useForm(addNewOfferHandler, {
    [OfferFormDataEnum.PropertyType]: "Апартамент",
    [OfferFormDataEnum.Location]: "",
    [OfferFormDataEnum.District]: "",
    [OfferFormDataEnum.Rooms]: "",
    [OfferFormDataEnum.Floor]: "",
    [OfferFormDataEnum.Price]: "",
    [OfferFormDataEnum.Currency]: "",
    [OfferFormDataEnum.Area]: "",
    [OfferFormDataEnum.YearOfBuilding]: "",
    [OfferFormDataEnum.Description]: "",
  });

  return (
    <div className={styles["create-offer-page"]}>
      <h1>Създай нова оферта</h1>
      <Card className={styles["add-new-offer-wrapper"]}>
        <form
          className={styles["add-new-offer-form"]}
          onSubmit={onSubmit}
          action=""
        >
          <div>
            <label htmlFor="propertyType">Тип на имота:</label>
            <select
              id="propertyType"
              name="propertyType"
              required
              onChange={onChange}
            >
              <option value="Апартамент">Апартамент</option>
              <option value="Къща">Къща</option>
              <option value="Парцел">Парцел</option>
            </select>
          </div>
          <div>
            <label htmlFor="location">Град:</label>
            <select id="location" name="location" required onChange={onChange}>
              <option value={undefined} selected hidden>
                Град
              </option>
              {cities
                .map((city) => city.City)
                .filter(onlyUnique)
                .map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="district">Квартал:</label>
            <select
              id="district"
              name="district"
              disabled={!values[OfferFormDataEnum.Location]}
              onChange={onChange}
            >
              <option value={undefined} selected hidden>
                Квартал
              </option>
              {cities
                .filter(
                  (city) => city.City === values[OfferFormDataEnum.Location]
                )
                .map((location) => location.District)
                .map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="rooms">Стаи:</label>
            <input
              required
              type="number"
              id="rooms"
              name="rooms"
              onChange={onChange}
              value={values[OfferFormDataEnum.Rooms]}
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
              value={values[OfferFormDataEnum.Floor]}
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
              value={values[OfferFormDataEnum.Price]}
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
              value={values[OfferFormDataEnum.Currency]}
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
              value={values[OfferFormDataEnum.Area]}
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
              value={values[OfferFormDataEnum.YearOfBuilding]}
              min={1900}
              max={2030}
            />
          </div>
          <div>
            {" "}
            <label htmlFor="description">Описание:</label>
            <textarea
              required
              id="description"
              name="description"
              onChange={onChange}
              value={values[OfferFormDataEnum.Description]}
              minLength={100}
              maxLength={1200}
            />
          </div>
          <Button type="submit" value="Submit">
            Създай обява
          </Button>
        </form>
      </Card>
    </div>
  );
};
