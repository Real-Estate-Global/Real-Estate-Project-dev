import { OfferList } from "./OfferList/OfferList";
import { HeadingImage } from "./HeadingImage";
import { SearchToolbar } from "./SearchToolbar/SearchToolbar";
import { useGetFilteredOffers } from "../hooks/useFilterOffers";
import { Loader } from "./Loader";

type Props = {
  onGetProfileData: () => void;
}

export const HomePage = ({ onGetProfileData }: Props) => {
  const { filteredOffers, selectedFilters, isLoading } = useGetFilteredOffers();

  console.log('selectedFilters:', selectedFilters);
  console.log('filteredOffers:', filteredOffers);
  return (
    <div className="home-page-wrapper">
      <Loader show={isLoading} />
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
        <SearchToolbar selectedFilters={selectedFilters} />
      </div>
      <OfferList offers={filteredOffers} onGetProfileData={onGetProfileData} />
    </div>
  );
};
