import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { OfferType } from "../../types/OfferType";
// TODO: use routes from path
import { Path } from "../../paths";
import "./OfferCard.module.css";
import { DateTime } from "luxon";

type Props = {
  offer: OfferType;
  editEnabled?: boolean;
  onEditClick?: (id: string, values: OfferType) => void;
  onDeleteClick?: (id: string) => void;
};

export const OfferCard: React.FC<Props> = ({
  offer,
  editEnabled = false,
  onEditClick,
  onDeleteClick,
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

  return (
    <div className="offer-card col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
      <Card
        title={propertyType}
        className="border-1 surface-border surface-card border-round p-0"
        header={
          <Image
            src={
              "https://cdn.freecodecamp.org/curriculum/cat-photo-app/relaxing-cat.jpg"
            }
            alt={"image"}
          ></Image>
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
          <span className="text-600">
            {`${DateTime.fromJSDate(yearOfBuilding as Date).toFormat('yyyy')} г`}
          </span>
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          <Button
            label="Виж повече"
            className="p-0"
            text
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          />
          <div className="flex justify-content-between mt-3 mb-2">
            {editEnabled && (
              <Button
                raised
                icon="pi pi-pencil"
                onClick={() => {
                  onEditClick && onEditClick(_id, offer);
                }}
              />
            )}
            {editEnabled && (
              <Button
                severity="danger"
                raised
                icon="pi pi-trash"
                onClick={() => {
                  onDeleteClick && onDeleteClick(_id);
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
