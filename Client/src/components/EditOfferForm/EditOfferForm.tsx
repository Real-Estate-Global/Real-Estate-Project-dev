import {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditOfferForm.module.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Path } from "../../paths";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  useEditMyOfferMutation,
  useGetMyOfferMutation,
} from "../../store/api/privateOffers";
import { loadingSliceActions } from "../../store/slices/loading";
import { errorSliceActions } from "../../store/slices/error";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";
import { ErrorType } from "../../types/ErrorType";
import { authSliceSelectors } from "../../store/slices/auth";

export const EditOfferForm = () => {
  // TODO: implement local error handling
  const { _id } = useParams();
  const navigate = useNavigate();
  const [editMyOffer] = useEditMyOfferMutation();
  const [getMyOffer] = useGetMyOfferMutation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

  const [values, setValues] = useState<OfferType | null>();
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

  useEffect(() => {
    if (_id) {
      setLoading(true);
      getMyOffer(_id).then((result) => {
        if (result.data) {
          setValues(result.data);
          setLoading(false);
        }

        // TODO: error handling fetch fail?
      });
    }
  }, [_id, setValues, setLoading]);

  const editOfferHandler = useCallback(
    async (id: string, values: OfferType) => {
      try {
        setLoading(true);
        await editMyOffer({ id, editOfferData: values }).then(() => {
          navigate(Path.MyOffers) as any;
        });
      } catch (e: any) {
        setError({ hasError: true, message: e.message });
      } finally {
        setLoading(false);
      }
    },
    [editMyOffer, setLoading, setError, navigate]
  );

  const onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    useCallback(
      (e) => {
        if (typeof e.target.name === "string") {
          if (values) {
            setValues({
              ...values,
              [e.target.name as any]: e.target.value as any,
            });
          }
        }
      },
      [values]
    );

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (_id && values) {
        editOfferHandler(_id, values);
      }
    },
    [_id, values]
  );

  if (!values) {
    return null;
  }

  if (!isAuthenticated) {
    return <div>Login please</div>;
  }

  return (
    <>
      <div className={styles["create-new-offer-wrapper"]}>
        <Card className={styles["create-new-offer-card"]}>
          <h1 className={styles["edit-offer-form-title"]}>Редактирай оферта</h1>
          <form
            className={styles["edit-new-offer-form"]}
            onSubmit={onSubmit}
            action=""
          >
            <div className={styles["row"]}>
              <div className={styles["left-half"]}>
                <div>
                  <label htmlFor="type-edit-form">Тип на имота:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="text"
                    id="type-edit-form"
                    name="propertyType"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.PropertyType]}
                  />
                </div>

                <div>
                  <label htmlFor="location-edit-form">Град:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="text"
                    id="location-edit-form"
                    name="location"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Location]}
                  />
                </div>

                <div>
                  <label htmlFor="district-edit-form">Квартал:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="text"
                    id="district-edit-form"
                    name="district"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.District]}
                  />
                </div>

                <div>
                  <label htmlFor="rooms-edit-form">Стаи:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="number"
                    id="rooms-edit-form"
                    name="rooms"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Rooms]}
                  />
                </div>

                <div>
                  <label htmlFor="floor-edit-form">Етаж:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="number"
                    id="floor-edit-form"
                    name="floor"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Floor]}
                  />
                </div>
              </div>

              <div className={styles["right-half"]}>
                <div>
                  <label htmlFor="price-edit-form">Цена:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="number"
                    id="price-edit-form"
                    name="price"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Price]}
                  />
                </div>

                <div>
                  <label htmlFor="currency-edit-form">Валута:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="text"
                    id="currency-edit-form"
                    name="currency"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Currency]}
                  />
                </div>

                <div>
                  <label htmlFor="area-edit-form">Площ:</label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="number"
                    id="area-edit-form"
                    name="area"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Area]}
                  />
                </div>

                <div>
                  <label htmlFor="yearOfBuilding-edit-form">
                    Година на строителство:
                  </label>
                  <input
                    className={styles["edit-offer-input"]}
                    type="number"
                    id="yearOfBuilding-edit-form"
                    name="yearOfBuilding"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.YearOfBuilding]}
                  />
                </div>

                <div>
                  <label htmlFor="description-edit-form">Описание:</label>
                  <textarea
                    className={styles["edit-offer-input-textarea"]}
                    id="description-edit-form"
                    name="description"
                    onChange={onChange}
                    value={values[OfferFormDataEnum.Description]}
                  />
                </div>
              </div>
            </div>
            <Button
              className={styles["edit-offer-button"]}
              variant="primary"
              type="submit"
              value="Редактирай"
            >
              Редактирай
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};
