import { useParams } from "react-router-dom";
import { OfferDetails } from "../OfferDetails/OfferDetails.js";
import { useAppSelector } from "../../store/hooks.js";
import { authSliceSelectors } from "../../store/slices/auth.js";
import { useGetMyOfferQuery } from "../../store/api/privateOffers.js";
import styles from "./OfferPage.module.css";
import { Loader } from "../Loader.js";

export const MyOfferPage = () => {
  const { _id } = useParams();
  const getMyOfferQuery = useGetMyOfferQuery(_id as string);
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

  const myProperty = getMyOfferQuery.data

  if (!isAuthenticated) {
    // TODO: better please login
    return <div>Please Login</div>;
  }

  return (
    <div className={styles["offer-wrapper"]}>
      <Loader show={getMyOfferQuery.isLoading} />
      <OfferDetails offerDetails={myProperty} />
    </div>
  );
};
