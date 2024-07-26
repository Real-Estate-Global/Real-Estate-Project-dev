import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import styles from "./OfferCard.module.css";
import { OfferType } from "../../types/OfferType";
import { useCallback } from "react";
import { Path } from "../../paths";

type Props = {
  offer: OfferType;
  editEnabled: boolean;
  setConfirmDeletePoupState?: (data: {
    show: boolean;
    id: string | null;
  }) => void;
};

export const OfferCard: React.FC<Props> = ({
  offer,
  editEnabled,
  setConfirmDeletePoupState,
}) => {
  const navigate = useNavigate();
  const {
    visited,
    location,
    propertyType,
    district,
    price,
    currency,
    area,
    yearOfBuilding,
    description,
    _id,
    img,
  } = offer;

  const onDeleteClick = useCallback(() => {
    if (editEnabled && setConfirmDeletePoupState) {
      setConfirmDeletePoupState({ show: true, id: _id });
    }
  }, [_id, editEnabled, setConfirmDeletePoupState]);

  return (
    <>
      <Card title={propertyType} className={styles["best-offers"]}>
        <ul className={styles["offer-characteristics"]}>
          <li className={styles["right-positioned-specs"]}>
            {location}, {district}
          </li>
          <li
            className={styles["right-positioned-specs"]}
          >{` Цена: ${price} ${currency === "EUR" ? " €" : " лв."}`}</li>
          <li
            className={styles["right-positioned-specs"]}
          >{`Площ: ${area} кв.м.`}</li>
          <li
            className={styles["right-positioned-specs"]}
          >{`Година на строителство: ${yearOfBuilding}`}</li>
          <li className={styles["short-offer-description-li"]}>
            <p className={styles["short-offer-description"]}>{description}</p>
          </li>
          <Button
            label="Виж повече"
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          />
          <li
            className={styles["right-positioned-specs"]}
          >{`Visited: ${visited}`}</li>
          {editEnabled && (
            <Button
              label="Редактирай"
              link
              onClick={() => {
                navigate(`/edit/${_id}`);
              }}
            />
          )}
          {editEnabled && (
            <Button
              onClick={onDeleteClick}
              className={styles["btn-delete-offer"]}
            >
              Изтрий обява
            </Button>
          )}
        </ul>
        <img className={styles["offer-heading-img"]} src={img} />
      </Card>
    </>
  );
};
