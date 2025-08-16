import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Tag } from 'primereact/tag';
import { OfferType } from "../../types/OfferType";
import "./OfferCard.module.css";
import { ImageFileType } from "../../types/ImageFileType";
import { Carousel } from "primereact/carousel";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { profileSliceSelectors } from "../../store/slices/profileSlice";
import { useEditProfileMutation } from "../../store/api/user";
import { NotificationManager } from "../Notifications";

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
  onGetProfileData: () => void;
};

export const OfferCard: React.FC<Props> = ({
  offer,
  editEnabled = false,
  onEditClick,
  onDeleteClick,
  onGetProfileData,
}) => {
  const profileData = useAppSelector(profileSliceSelectors.profileData);
  const [submitEditProfile, { isLoading: isEditProfileDataLoading, isError: editProfileDataError }] = useEditProfileMutation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (profileData.favorites?.includes(offer._id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [profileData.favorites, offer._id]);
  const onFavouriteClick = async () => {
    try {
      setIsLoading(true);
      if (isFavorite) {
        setIsFavorite(false);
        // Logic to remove from favorites
        await submitEditProfile({
          ...profileData,
          favorites: profileData.favorites?.filter(fav => fav !== offer._id) || [],
        });
        setTimeout(() => {
          onGetProfileData();
          setIsLoading(false);
        }, 50);
      } else {
        setIsFavorite(true);
        // Logic to add to favorites
        await submitEditProfile({
          ...profileData,
          favorites: profileData.favorites?.concat(offer._id) || [offer._id],
        });
        setTimeout(() => {
          onGetProfileData();
          setIsLoading(false);
        }, 50);
      }
    } catch (error) {
      console.error("Error toggling favourite status:", error);
      NotificationManager.showError({ message: "Неуспешно добавяне в любими." });
    }
  }
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
    <div className="offer-card md:col-4 p-2">
      <Card
        title={<div className="flex justify-content-between mt-3 mb-2">
          <span className="text-900 offer-card-price">
            {euro.format(price)}
          </span>
          <span className="text-900 text-xl ml-3"><Tag severity="success" value="Продажба" rounded style={{ padding: "3px 9px" }}></Tag></span>
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
        <div className="flex justify-content-between mt-3 mb-2">
          <span className="text-900 font-medium text-xl">
            {`${roomsToName[String(rooms)] ? roomsToName[String(rooms)] : "Многостаен"} ${propertyType}`}
          </span>
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          <span className="text-900 font-medium text-xl">
            <img className="offer-location-icon" src="./location-icon.png" />{location}, {district}
          </span>
          {/* <span className="text-900 text-xl ml-3">{currency + price}</span> */}
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          <span className="text-600"> <img className="offer-ruler-icon" src="./ruler-icon.png" />{area} кв.м.</span>
          <span className="text-600">
            {/* {`${DateTime.fromJSDate(yearOfBuilding as Date).toFormat('yyyy')}г.`} */}
            <img className="offer-location-icon" src="./build-icon.png" />
            {`${new Date(yearOfBuilding).toISOString().split('T')[0]}`}
          </span>
          <Button
            label="Виж повече"
            className="p-0"
            text
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          />
        </div>
        <div className="flex justify-content-between mt-3 mb-2">
          {/* <Button
            label="Виж повече"
            className="p-0"
            text
            link
            onClick={() => {
              navigate(`${editEnabled ? "/secure" : ""}/properties/${_id}`);
            }}
          /> */}
          <div className={`flex justify-content-between mt-3 mb-2 gap-2`}>
            {editEnabled && (
              <><Button
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
                /></>
            )}
            <Button
              severity="help"
              raised
              icon={`pi ${isFavorite ? "pi-heart-fill" : "pi-heart"}`}
              onClick={onFavouriteClick}
              disabled={isLoading || isEditProfileDataLoading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
