import { useParams } from "react-router-dom";
import { OfferDetails } from "../OfferDetails/OfferDetails";
import styles from "./OfferPage.module.css";
import { useGetPublicOfferQuery } from "../../store/api/publicOffers";
import { Loader } from "../Loader";

export const PublicOfferPage = () => {
  const { offerId } = useParams();
  const getPublicOfferQuery = useGetPublicOfferQuery(offerId as string);
  const offer = getPublicOfferQuery.data

  return (
    <div className={styles["offer-wrapper"]}>
      <Loader show={getPublicOfferQuery.isLoading} />
      <OfferDetails offerDetails={offer} />
    </div>
  );
};
