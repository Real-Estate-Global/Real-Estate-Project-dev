import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { OfferType } from "../../types/OfferType";
import { useCallback } from "react";
import { Path } from "../../paths";
import "./OfferCard.module.css"

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
    <div className="offer-card col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
      <Card
        title={propertyType}
        className="border-1 surface-border surface-card border-round p-0"
        header={
          <img
            src={
              "https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg"
            }
            alt={"image"}
          ></img>
        }
      >
        <div className="flex justify-content-between mt-3 mb-2">
          <span className="text-900 font-medium text-xl">
            {location}, {district}
          </span>
          <span className="text-900 text-xl ml-3">{currency + price}</span>
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          <span className="text-600">{area} кв.м.</span>
          <span className="text-600">{yearOfBuilding} г.</span>
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          <Button
            className="p-0"
            label="Виж повече"
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          />
          {editEnabled && (
            <Button
              label="Редактирай"
              link
              onClick={() => {
                navigate(`/edit/${_id}`);
              }}
            />
          )}
          {editEnabled && <Button onClick={onDeleteClick}>Изтрий обява</Button>}
        </div>
      </Card>
    </div>
  );
};
