import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Galleria } from "primereact/galleria";
import { useNavigate } from "react-router-dom";
import { OfferType } from "../../types/OfferType";
import { ImageFileType } from "../../types/ImageFileType";
// import "./offer-card.css"; // <-- включи CSS-а

const roomsToName: Record<string, string> = {
  "1": "Едностаен",
  "2": "Двустаен",
  "3": "Тристаен",
  "4": "Многостаен",
};

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
    _id,
    images = [],
    price,
    area,
    rooms,
    propertyType,
    location,
    district,
    yearOfBuilding,
    isNew,
    exclusive,
    tags = [],
  } = offer;

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const imageUrls = (images as ImageFileType[]).map((i) => i.url);
  // const titleText = `${roomsToName[String(rooms)] ?? "Многостаен"} ${
  //   propertyType === "Апартамент"
  //     ? propertyType.toLocaleLowerCase()
  //     : propertyType
  // }`;

  const titleText = ` ${propertyType === "Апартамент"
    ? propertyType.toLocaleLowerCase()
    : propertyType
    }`;

  console.log("testetstet", propertyType)

  const header = (
    <>
      <div className="offer-card-view offer-card-media">
        <Galleria
          className="offer-card-galleria"
          value={imageUrls}
          numVisible={1}
          showThumbnails={false}
          showIndicators={false}            // скриваме точките
          showItemNavigators                // показваме стрелките
          circular
          item={(src) => (
     
            <img className="offer-card-media-img" src={src as string} alt={titleText}  onClick={() => navigate(`/properties/${_id}`) }/>
          )}
        />
        <div className="offer-card-badges">
          {isNew && <span className="offer-card-badge offer-card-badge--new">НОВА</span>}
          <span className="offer-card-badge offer-card-badge--new">НОВА</span>
          {exclusive && (
            <span className="offer-card-badge offer-card-badge--ex">ЕКСКЛУЗИВ</span>
          )}
          <span className="offer-card-badge offer-card-badge--ex">ЕКСКЛУЗИВ</span>
          {tags.slice(0, 2).map((t) => (
            <span key={t} className="offer-card-badge">
              {t}
            </span>
          ))}
        </div>

        <Button
          className="offer-card-save-btn"
          text
          rounded
          icon="pi pi-bookmark"
          aria-label="Запази"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="hidden-layer">Виж детайли</div>
    </>
  );

  return (
    <div className="offer-card-view md:col-4 p-2">
      <Card
        className="offer-card"
        header={header}
      // onClick={() => navigate(`/properties/${_id}`)}
      >
        <div className="offer-card-body">
          <div className="offer-card-title" title={titleText}>
            {titleText}
          </div>

          <div className="offer-card-price-row">
            <div className="offer-card-price">{fmt.format(Number(price))}</div>
          </div>

          <div className="offer-card-meta">
            <i className="pi pi-map-marker" />
            <span>
              {location}, {district}
            </span>
          </div>

          <div className="offer-card-specs">
            <span className="offer-card-spec">
              <i className="pi pi-expand" />
              {area} м²
            </span>
            <span className="offer-card-spec">
              <i className="pi pi-th-large" />
              {rooms} стаи
            </span>
            {!!yearOfBuilding && (
              <span className="offer-card-spec">
                <i className="pi pi-calendar" />
                {new Date(yearOfBuilding as any).getFullYear()}
              </span>
            )}
            <Button
              className="offer-card-cta"
              label="Детайли"
              icon="pi pi-eye"
              outlined                         // по-лек стил
              onClick={() => navigate(`/properties/${_id}`)}
            />
          </div>
        </div>

        <div className="offer-card-actions" onClick={(e) => e.stopPropagation()}>
          {editEnabled ? (
            <div className="offer-card-edit-actions">
              <Button
                rounded
                icon="pi pi-pencil"
                aria-label="Редактирай"
                onClick={() => navigate(`/properties/edit/${_id}`)}
              />
              <Button
                rounded
                severity="danger"
                icon="pi pi-trash"
                aria-label="Изтрий"
                onClick={() => onDeleteClick && onDeleteClick(_id)}
              />
            </div>
          ) : (
            // <Button
            //   className="offer-card-cta"
            //   label="Виж детайли"
            //   icon="pi pi-eye"
            //   outlined                         // по-лек стил
            //   onClick={() => navigate(`/properties/${_id}`)}
            // />
            ""
          )}
          {/* <Button
            className="offer-card-cta"
            label="Виж детайли"
            icon="pi pi-eye"
            outlined                         // по-лек стил
            onClick={() => navigate(`/properties/${_id}`)}
          /> */}
        </div>
      </Card>
    </div>
  );
};
