import { useAppSelector } from "../../store/hooks";
// import { offerSliceSelectors } from "../../store/slices/offerSlice";
import { OfferType } from "../../types/OfferType";
import styles from "./OfferDetails.module.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";

import AreaIcon from '../../assets/icons/area-icon-final.svg?react';
import { BedDouble, ChevronsDownUp, Expand, Layers, MapPin, Pickaxe, ShowerHead, TableCellsMerge, Warehouse } from "lucide-react";


type Props = {
  offerDetails?: OfferType
}

const roomsToName: { [key: string]: string } = {
  1: "Едностаен",
  2: "Двустаен",
  3: "Тристаен",
  4: "Многостаен",
}

export const OfferDetails: React.FC<Props> = ({ offerDetails }) => {
  // const offerDetails = useAppSelector(offerSliceSelectors.selectedOffer);
  // console.log("HELLO")
  console.log("photos", offerDetails?.images);
  if (!offerDetails) {
    return <p>Loading...</p>;
  }

  let euro = Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
    // maximumSignificantDigits: 6,
    maximumFractionDigits: 0
  });

  const productTemplate = (image: string) => (
    <div className="surface-border border-round m-2 text-center py-5 px-3">
      <img src={image} alt="Property" style={{ width: "100%", height: "auto" }} />
    </div>
  );

  console.log("year", new Date(offerDetails.yearOfBuilding).toISOString().split('T')[0])

  const offerPhotosUrls = offerDetails.images.map((img) => img.url)

  return (
    <div className="offer-details-page p-4" style={{ alignItems: "stretch", fontFamily: "Comfortaa", display: "flex" }}>
      {/* Title Section */}
      <div className="mb-10" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "auto", width: "90%" }}>
        {/* <h1 className="text-2xl font-bold">{offerDetails.propertyType} в {offerDetails.district}</h1> */}
        {/* <h1 className="text-2xl font-bold" style={{fontSize: "30px"}}>{`${roomsToName[String(offerDetails.rooms)] ? roomsToName[String(offerDetails.rooms)] : "Многостаен"} ${offerDetails.propertyType.toLocaleLowerCase()}`} в {offerDetails.district}</h1> */}
        {/* <h1 className=" font-bold" style={{ fontSize: "28px" }}>{`${roomsToName[String(offerDetails.rooms)] ? roomsToName[String(offerDetails.rooms)] : "Многостаен"} ${offerDetails.propertyType.toLocaleLowerCase()}`} в {offerDetails.district}</h1> */}
        {/* {`${roomsToName[String(rooms)] ? roomsToName[String(rooms)] : "Многостаен"} ${propertyType}`} */}
        {/* <p className="text-gray-500 text-lg"> */}
        {/* <p className="" style={{fontSize: "28px"}}>
          {`${offerDetails.price} ${offerDetails.currency}`} · {`${offerDetails.area} кв.м`} · {`${offerDetails.location}, ${offerDetails.district}`}
        </p> */}
      </div>
      <div className="first-section-offer-details" style={{ display: "flex", justifyContent: "center" }}>
        {/* Gallery Section */}


        {/* Property Specs Section */}
        <Card className="mb-10 offer-details-card" style={{ display: "flex", justifyContent: "center" }}>


          <div className="mb-10 offer-carousel-wrapper" >
            <Carousel value={offerPhotosUrls} numVisible={1} numScroll={1} itemTemplate={productTemplate} style={{ height: "500px" }} />
          </div>
          <div className="grid" style={{ width: "50%" }}>
            <h1 className=" font-bold" style={{ fontSize: "28px", marginBottom: "10px" }}>{`${roomsToName[String(offerDetails.rooms)] ? roomsToName[String(offerDetails.rooms)] : "Многостаен"} ${offerDetails.propertyType.toLocaleLowerCase()}`} в {offerDetails.district}</h1>
            <p className="" style={{ fontSize: "28px", margin: "5px 0px" }}>
              {`${euro.format(offerDetails.price)}`} · {`${offerDetails.location}, ${offerDetails.district}`}
            </p>
            <div className="col-6">
              {/* <p><strong>Тип:</strong> {offerDetails.propertyType}</p> */}
              {/* <p><strong><AreaIcon style={{ stroke: "#162350", fill: '#162350', width: 33, height: 33 }} /> Площ:</strong> {`${offerDetails.area} кв.м`} </p> */}
              <p className="offer-specification-paragraph"><Expand /><strong> Площ:</strong> {`${offerDetails.area} кв.м`} </p>
              {/* <div className="offer-card-icon-wrapper">
                <AreaIcon style={{ stroke: "#162350", fill: '#162350', width: 33, height: 33 }} />
                {offerDetails.area} кв.м.
              </div> */}
              <p className="offer-specification-paragraph"><MapPin /><strong>Локация:</strong> {offerDetails.floor}</p>
              <p className="offer-specification-paragraph"><BedDouble /><strong>Спални:</strong> {offerDetails.floor}</p>
              <p className="offer-specification-paragraph"> <ShowerHead /><strong>Бани:</strong> {offerDetails.floor}</p>
              <p className="offer-specification-paragraph"><Layers /><strong>Етаж:</strong> {offerDetails.floor}</p>

              {/* <p className="offer-specification-paragraph"><strong>Състояние:</strong> {offerDetails.condition || "Не е посочено"}</p> */}
            </div>
            <div className="col-6">
              <p className="offer-specification-paragraph"><TableCellsMerge width={32} height={32} /><strong>Строителство:</strong> {offerDetails.constructionType || "Тухла"}</p>
              <p className="offer-specification-paragraph"><Pickaxe /><strong>Строеж:</strong> {`${new Date(offerDetails.yearOfBuilding).getFullYear()}`}</p>
              <p className="offer-specification-paragraph"><ChevronsDownUp /><strong>Асансьор:</strong> Не</p>
              <p className="offer-specification-paragraph"> <Warehouse /><strong>Гараж:</strong> Да</p>
              <p className="offer-specification-paragraph"> <Warehouse /><strong>Гараж:</strong> Да</p>
              {/* {`${new Date(yearOfBuilding).toISOString().split('T')[0]}`} */}
              {/* <p className="offer-specification-paragraph"><strong>Отопление:</strong> {offerDetails.heating || "Не е посочено"}</p> */}
            </div>

            <div className="offer-action-buttons" style={{ fontSize: "10px", display: "flex", }}>
              <div className="offer-action-buttons">
                <Button className="offer-details-button" label="Запази" icon="pi pi-heart" />
                <Button className="offer-details-button" label="Чат" icon="pi pi-print" />
                {/* </div>
              <div className="offer-action-buttons"> */}
                <Button className="offer-details-button" label="Сподели" icon="pi pi-share-alt" />
                <Button className="offer-details-button" label="Принт" icon="pi pi-print" />
              </div>
              {/* <Button className="offer-details-button" label="Принтирай" icon="pi pi-print" /> */}
            </div>
          </div>
        </Card>

      </div>

      {/* Description Section */}
      <Card title="Описание" className="mb-10 offer-details-card">
        <p className="offer-specification-paragraph">{offerDetails.description}</p>
      </Card>

      {/* Map Section */}
      <Card title="Локация" className="mb-10 offer-details-card third-section-details" style={{
        display: "flex", width: "100%"
      }}>
        <iframe
          src={`https://www.google.com/maps?q=${offerDetails.location}&output=embed`}
          width="50%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
        <div title="Контакт с агент" className="mb-10 offer-details-card">
          <div className="flex align-items-center gap-3">
            <div className="avatar bg-primary text-white flex align-items-center justify-content-center border-circle" style={{ width: "50px", height: "50px" }}>
              {/* {offerDetails.agent?.name.charAt(0).toUpperCase()} */}
            </div>
            <div>
              {/* <p className="offer-specification-paragraph"><strong>{offerDetails.agent?.name}</strong></p>
            <p className="offer-specification-paragraph">{offerDetails.agent?.agency}</p> */}
            </div>
          </div>
          <Button className="offer-details-button" label="Изпрати запитване" icon="pi pi-envelope" className="mt-3" />
        </div>
      </Card>

      {/* Contact Section */}
      <Card title="Контакт с агент" className="mb-10 offer-details-card">
        <div className="flex align-items-center gap-3">
          <div className="avatar bg-primary text-white flex align-items-center justify-content-center border-circle" style={{ width: "50px", height: "50px" }}>
            {/* {offerDetails.agent?.name.charAt(0).toUpperCase()} */}
          </div>
          <div>
            {/* <p><strong>{offerDetails.agent?.name}</strong></p>
            <p>{offerDetails.agent?.agency}</p> */}
          </div>
        </div>
        <Button className="offer-details-button" label="Изпрати запитване" icon="pi pi-envelope" className="mt-3" />
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-10 offer-details-card">
        <Button className="offer-details-button" label="Добави в любими" icon="pi pi-heart" />
        <Button className="offer-details-button" label="Сподели" icon="pi pi-share-alt" />
        <Button className="offer-details-button" label="Принтирай" icon="pi pi-print" />
      </div>

      {/* Related Listings */}
      <Card title="Подобни имоти" className="offer-details-card">
        <div className="grid">
          {/* {offerDetails.relatedOffers?.map((offer) => (
            <div className="col-12 md:col-4" key={offer._id}>
              <Card title={offer.propertyType} subTitle={`${offer.price} ${offer.currency}` offer-details-card}>
                <p>{offer.location}, {offer.district}</p>
              </Card>
            </div>
          ))} */}
        </div>
      </Card>
    </div>
  );
};