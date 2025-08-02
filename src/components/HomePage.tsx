import { OfferList } from "./OfferList/OfferList";
import { HeadingImage } from "./HeadingImage";
import { useState, useEffect } from "react";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { OfferType } from "../types/OfferType";
import { HomeSearchNew } from "./HomeSearchNew/HomeSearchNew";
import { useFilterOffers } from "../hooks/useFilterOffers";
import { Loader } from "./Loader";

type Props = {
  onGetProfileData: () => void;
}
export const HomePage = ({ onGetProfileData } : Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [offers, setOffers] = useState<OfferType[]>([]);
  const [getPublicOffers, { isLoading: isGetPublicOffersLoading }] = useGetPublicOffersMutation();

  useEffect(() => {
    getPublicOffers(null).then((result) => {
      if (result.data) {
        setOffers(result.data);
      }
    });
  }, []);

  useEffect(() => {
    setIsLoading(isGetPublicOffersLoading)
  }, [isGetPublicOffersLoading])
  const { filteredOffers } = useFilterOffers(offers);

  return (
    <>
      <Loader show={isLoading} />
      <HeadingImage />
      <HomeSearchNew setIsLoading={setIsLoading} />
      <OfferList offers={filteredOffers} onGetProfileData={onGetProfileData} />
    </>
  );
};
