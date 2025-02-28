import { OfferList } from "./OfferList/OfferList";
import { HeadingImage } from "./HeadingImage";
// import { SearchForm } from "./SearchFormLegacy";
import { useState, useCallback, useEffect } from "react";
import { FiltersType } from "../types/FiltersType";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { OfferType } from "../types/OfferType";
import { Loader } from "./Loader";
import { HomeSearchToolbar } from "./HomeSearchToolbar/HomeSearchToolbar";
import { HomeSearchNew } from "./HomeSearchNew/HomeSearchNew";

export const HomePage = () => {
  const [offers, setOffers] = useState<OfferType[]>([]);
  const [getPublicOffers, { isLoading, isError }] = useGetPublicOffersMutation();

  useEffect(() => {
    getPublicOffers(null).then((result) => {
      if (result.data) {
        setOffers(result.data);
      }
    });
  }, [getPublicOffers, setOffers]);

  const getHomeOfferList = useCallback(
    async (filters: FiltersType) => {
      getPublicOffers(filters).then((result) => {
        if (result.data) {
          setOffers(result.data);
        }
      });
    },
    [getPublicOffers, setOffers]
  );

  return (
    <>
      <Loader show={isLoading} />
      <HeadingImage />
      <HomeSearchNew />
      <OfferList offers={offers} />
    </>
  );
};
