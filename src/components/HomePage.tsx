import { OfferList } from "./OfferList/OfferList";
import { HeadingImage } from "./HeadingImage";
import { useState, useEffect } from "react";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { OfferType } from "../types/OfferType";
import { HomeSearchNew } from "./HomeSearchNew/HomeSearchNew";
import { useFilterOffers } from "../hooks/useFilterOffers";

export const HomePage = () => {
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
      <HeadingImage />
      <HomeSearchNew setIsLoading={setIsLoading} isLoading={isLoading} />
      <OfferList isLoading={isLoading} offers={filteredOffers} />
    </>
  );
};
