import { useAppSelector } from "../../store/hooks";
// import { offerSliceSelectors } from "../../store/slices/offerSlice";
import { OfferType } from "../../types/OfferType";
import styles from "./OfferDetails.module.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";

type Props = {
  offerDetails?: OfferType
} 

export const OfferDetails: React.FC<Props> = ({offerDetails}) => {
  // const offerDetails = useAppSelector(offerSliceSelectors.selectedOffer);
  console.log("HELLO")
  console.log("photos", offerDetails?.images);
  if (!offerDetails) {
    return <p>Loading...</p>;
  }

  const productTemplate = (image: string) => (
    <div className="surface-border border-round m-2 text-center py-5 px-3">
      <img src={image} alt="Property" style={{ width: "100%", height: "auto" }} />
    </div>
  );

  return (
    <div className="offer-details-page p-4" style={{alignItems: "stretch"}}>
      {/* Title Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{offerDetails.propertyType} в {offerDetails.district}</h1>
        <p className="text-gray-500 text-lg">
          {`${offerDetails.price} ${offerDetails.currency}`} · {`${offerDetails.area} кв.м`} · {`${offerDetails.location}, ${offerDetails.district}`}
        </p>
      </div>

      {/* Gallery Section */}
      <div className="mb-4">
        <Carousel value={offerDetails.images} numVisible={1} numScroll={1} itemTemplate={productTemplate} />
      </div>

      {/* Property Specs Section */}
      <Card title="Основни характеристики" className="mb-4">
        <div className="grid">
          <div className="col-6">
            <p><strong>Тип:</strong> {offerDetails.propertyType}</p>
            <p><strong>Етаж:</strong> {offerDetails.floor}</p>
            <p><strong>Състояние:</strong> {offerDetails.condition || "Не е посочено"}</p>
          </div>
          <div className="col-6">
            <p><strong>Строителство:</strong> {offerDetails.construction || "Не е посочено"}</p>
            <p><strong>Година:</strong> {offerDetails.yearOfBuilding}</p>
            <p><strong>Отопление:</strong> {offerDetails.heating || "Не е посочено"}</p>
          </div>
        </div>
      </Card>

      {/* Description Section */}
      <Card title="Описание" className="mb-4">
        <p>{offerDetails.description}</p>
      </Card>

      {/* Map Section */}
      <Card title="Локация" className="mb-4">
        <iframe
          src={`https://www.google.com/maps?q=${offerDetails.location}&output=embed`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </Card>

      {/* Contact Section */}
      <Card title="Контакт с агент" className="mb-4">
        <div className="flex align-items-center gap-3">
          <div className="avatar bg-primary text-white flex align-items-center justify-content-center border-circle" style={{ width: "50px", height: "50px" }}>
            {/* {offerDetails.agent?.name.charAt(0).toUpperCase()} */}
          </div>
          <div>
            {/* <p><strong>{offerDetails.agent?.name}</strong></p>
            <p>{offerDetails.agent?.agency}</p> */}
          </div>
        </div>
        <Button label="Изпрати запитване" icon="pi pi-envelope" className="mt-3" />
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <Button label="Добави в любими" icon="pi pi-heart" />
        <Button label="Сподели" icon="pi pi-share-alt" />
        <Button label="Принтирай" icon="pi pi-print" />
      </div>

      {/* Related Listings */}
      <Card title="Подобни имоти">
        <div className="grid">
          {/* {offerDetails.relatedOffers?.map((offer) => (
            <div className="col-12 md:col-4" key={offer._id}>
              <Card title={offer.propertyType} subTitle={`${offer.price} ${offer.currency}`}>
                <p>{offer.location}, {offer.district}</p>
              </Card>
            </div>
          ))} */}
        </div>
      </Card>
    </div>
  );
};