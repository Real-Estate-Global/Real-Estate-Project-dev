import { OfferList } from "./OfferList/OfferList";
import { HeadingImage } from "./HeadingImage";
import { useState, useEffect } from "react";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { OfferType } from "../types/OfferType";
import { Loader } from "./Loader";
import { HomeSearchNew } from "./HomeSearchNew/HomeSearchNew";
import { useAppSelector } from "../store/hooks";
import { filtersSliceSelectors } from "../store/slices/filters";
import { FiltersTypeEnum } from "../types/FiltersType";

export const HomePage = () => {
  const [offers, setOffers] = useState<OfferType[]>([]);
  const [getPublicOffers, { isLoading }] = useGetPublicOffersMutation();
  const selectedFilters = useAppSelector(filtersSliceSelectors.selectedFilters);

  useEffect(() => {
    getPublicOffers(null).then((result) => {
      if (result.data) {
        setOffers(result.data);
      }
    });
  }, []);

  const filteredOffers = selectedFilters
    ? offers.filter((offer) => {
      if (selectedFilters[FiltersTypeEnum.PropertyType]) {
        if (offer.propertyType !== selectedFilters[FiltersTypeEnum.PropertyType]) {
          return false
        }
      }
      if (selectedFilters[FiltersTypeEnum.City]) {
        if (offer.location !== selectedFilters[FiltersTypeEnum.City]) {
          return false
        }
      }
      if (selectedFilters[FiltersTypeEnum.RoomsLowest]) {
        if (offer.rooms < selectedFilters[FiltersTypeEnum.RoomsLowest]) {
          return false
        }
      }
      if (selectedFilters[FiltersTypeEnum.RoomsHighest]) {
        if (offer.rooms > selectedFilters[FiltersTypeEnum.RoomsHighest]) {
          return false
        }
      }

      return true
    })
    : offers;

  return (
    <>
      <Loader show={isLoading} />
      <HeadingImage />
      <HomeSearchNew />
      <OfferList offers={filteredOffers} />
    </>
  );
};
