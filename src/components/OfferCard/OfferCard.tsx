import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from 'primereact/tag';
import { OfferType } from "../../types/OfferType";
// TODO: use routes from path
import { Path } from "../../paths";
import "./OfferCard.module.css";
import { ImageFileType } from "../../types/ImageFileType";
import { Carousel } from "primereact/carousel";
// import { ReactComponent as AreaIcon } from '../../assets/icons/area-icon.svg';
import AreaIcon from '../../assets/icons/area-icon-final.svg?react';
import BuildingTypeIcon from '../../assets/icons/date-build-icon.svg?react'
import LocationIcon from '../../assets/icons/location-icon.svg?react'

const roomsToName: { [key: string]: string } = {
  1: "Едностаен",
  2: "Двустаен",
  3: "Тристаен",
  4: "Многостаен",
}

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
    images,
    rooms
  } = offer;

  // const separetedPrice = price.toLocaleString()
  let euro = Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
    // maximumSignificantDigits: 6,
    maximumFractionDigits: 0
  });

  const productTemplate = (image: ImageFileType) => {
    return (
      <div className="surface-border border-round m-2 text-center py-5 px-3">
        <div className="mb-3">
          <Image src={image.url} />
        </div>
      </div>
    );
  };
  const firstImage: ImageFileType = images && images[0]
  return (
    <div className="offer-card md:col-4 p-2" onClick={() => {
      // navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
      navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
    }}>
      <Card style={{ fontFamily: "Comfortaa" }}
        title={<div className="flex justify-content-between mt-3 mb-4" style={{ position: "relative", display: "flex", alignItems: "center", padding: "0px 4px" }}>
          <span className="text-900 offer-card-price">
            {euro.format(price)}
          </span>
          {/* <div className="flex justify-content-between" style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <span className="text-900 font-medium accent-info" style={{margin: "0", fontSize: "20px"}}>
              {`${roomsToName[String(rooms)] ? roomsToName[String(rooms)] : "Многостаен"} ${propertyType}`}
            </span>
          </div> */}
          <span className="text-900 text-xl ml-3" style={{
            // position: "absolute",
            // right: "0px",
            // top: "-72px",
          }}>
            <Tag severity="success" value="Продажба" rounded style={{
              padding: "3px 9px", fontFamily: "Comfortaa", fontSize: "13px", backgroundColor: "rgba(34, 197, 94, 0.7)"
            }}></Tag></span>
        </div>}
        className="surface-border surface-card border-round p-0"
        header={
          <div className="header-image-wrapper">
            <div className="card flex justify-content-center">
              <Carousel className="offer-card-carousel" value={images || []} numVisible={1} numScroll={1} orientation="horizontal" verticalViewPortHeight="120px" itemTemplate={productTemplate} />
            </div>
          </div>
        }
      >
        <div className="flex justify-content-between mt-3 mb-2" style={{}}>
          <span className="text-900 font-medium text-xl type-text">
            {`${roomsToName[String(rooms)] ? roomsToName[String(rooms)] : "Многостаен"} ${propertyType === "Апартамент" ? propertyType.toLocaleLowerCase() : propertyType}`}
          </span>
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          <span className="text-900 font-medium text-xl" style={{ marginLeft: "0px" }}>
            {/* <img className="offer-location-icon" src="./location-icon.png" />{location}, {district} */}
            <div className="offer-card-icon-wrapper" style={{ fontSize: "16px", color: "#4b5563" }}>
              <LocationIcon style={{ stroke: "#162350", fill: '#162350', width: 30, height: 30 }} />{location}, {district}
            </div>
          </span>
          {/* <span className="text-900 text-xl ml-3">{currency + price}</span> */}
        </div>
        <div className="flex justify-content-between mt-4 mb-1" style={{ borderTop: "1.5px solid #a6a6a6", borderBottom: "1.5px solid #a6a6a6", padding: "10px 0px", margin: "18px 0px", borderRadius: "2px" }}>
          {/* <span className="text-600"> <img className="offer-ruler-icon" style={{color: "pink"}} src="./area-icon.svg" />{area} кв.м.</span> */}
          <span className="text-600">
            {/* <img className="offer-ruler-icon" style={{ color: "pink" }} src="./area-icon.svg" />{area} кв.м. */}
            {/* <svg
              className="area-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="./area-icon.svg" />
            </svg> */}
            <div className="offer-card-icon-wrapper">
              <AreaIcon style={{ stroke: "#162350", fill: '#162350', width: 33, height: 33 }} />
              {area} кв.м.
            </div>
          </span>
          <span className="text-600">
            {/* {`${DateTime.fromJSDate(yearOfBuilding as Date).toFormat('yyyy')}г.`} */}
            {/* <img className="offer-location-icon" src="./build-icon.png" /> */}
            <div className="offer-card-icon-wrapper">
              <BuildingTypeIcon style={{ stroke: "#162350", fill: '#162350', width: 33, height: 33 }} />
              {`${new Date(yearOfBuilding).toISOString().split('T')[0]}`}
            </div>
          </span>
          <span className="text-600">
            {/* <img className="offer-ruler-icon" style={{ color: "pink" }} src="./area-icon.svg" />{area} кв.м. */}
            {/* <svg
              className="area-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path d="./area-icon.svg" />
            </svg> */}
            <div className="offer-card-icon-wrapper">
              <AreaIcon style={{ stroke: "#162350", fill: '#162350', width: 33, height: 33 }} />
              {area} кв.м.
            </div>
          </span>
          {/* <Button
            label="Виж повече"
            className="p-0"
            text
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          /> */}
        </div>
        {/* <div style={{display: "flex", justifyContent: "center", padding: "10px"}}>
          <Button
            label="Виж повече"
            className="p-0"
            text
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          />
        </div> */}
        {editEnabled && <div className="flex justify-content-between mt-3 mb-2">
          {/* <Button
            label="Виж повече"
            className="p-0"
            text
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          /> */}
          <div className={`flex justify-content-between mt-3 mb-2`}>
            <Button
              raised
              icon="pi pi-pencil"
              onClick={() => {
                onEditClick && onEditClick(_id, offer);
              }}
            />
            <Button
              severity="danger"
              raised
              icon="pi pi-trash"
              onClick={() => {
                onDeleteClick && onDeleteClick(_id);
              }}
            />
          </div>
        </div>}
      </Card>
    </div>
  );
};
