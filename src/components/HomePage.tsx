import { OfferList } from "./OfferList/OfferList";
import { HeadingImage } from "./HeadingImage";
import { useState, useEffect } from "react";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { OfferType } from "../types/OfferType";
import { SearchToolbar } from "./SearchToolbar/SearchToolbar";
import { useGetFilteredOffers } from "../hooks/useFilterOffers";
import { Loader } from "./Loader";
import { useAppSelector } from "../store/hooks";
import { publicOffersSliceSelectors } from "../store/slices/publicOffers";

type Props = {
  onGetProfileData: () => void;
}

export const HomePage = ({ onGetProfileData }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const isPublicOffersLoading = useAppSelector(publicOffersSliceSelectors.isLoading)
  const publicOffers = useAppSelector(publicOffersSliceSelectors.publicOffers)
  const [getPublicOffers] = useGetPublicOffersMutation();

  useEffect(() => {
    getPublicOffers(null);
  }, []);

  const { filteredOffers } = useGetFilteredOffers(publicOffers);

  return (
    <div className="home-page-wrapper">
      <Loader show={isPublicOffersLoading || isLoading} />
      <HeadingImage />
      <div className="searchFormDiv-wrapper">
        <div className="heading-titles">
          <h1>Умно търсене. Реални резултати.</h1>
          <h3>Discover the perfect home through our best search system</h3>
          <div>
            <button className="heading-button heading-search-button">Search</button>
            <button className="heading-button heading-why-us-button">Why us?</button>
          </div>
        </div>
        <SearchToolbar setIsLoading={setIsLoading} />
      </div>
      <OfferList offers={filteredOffers} onGetProfileData={onGetProfileData} />
    </div>
  );
};
