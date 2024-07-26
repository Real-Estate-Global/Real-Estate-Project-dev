import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OfferDetails } from "../OfferDetails/OfferDetails";
import styles from "./OfferPage.module.css";
import { useGetPublicOfferMutation } from "../../store/api/publicOffers";
import { OfferType } from "../../types/OfferType";
import { useAppDispatch } from "../../store/hooks";
import { loadingSliceActions } from "../../store/slices/loading";
import { ErrorType } from "../../types/ErrorType";
import { errorSliceActions } from "../../store/slices/error";

export const PublicOfferPage = () => {
  const { offerId } = useParams();
  const [getPublicOffer] = useGetPublicOfferMutation();
  const [offer, setOffer] = useState<OfferType | null>(null);
  const dispatch = useAppDispatch();

  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(loadingSliceActions.setLoading(isLoading));
    },
    [dispatch]
  );
  const setError = useCallback(
    (error: ErrorType) => {
      dispatch(errorSliceActions.setError(error));
    },
    [dispatch]
  );

  useEffect(() => {
    if (offerId) {
      try {
        getPublicOffer(offerId).then((result) => {
          if (result.data) {
            setOffer(result.data);
          }
        });
      } catch (e: any) {
        setError({ hasError: true, message: e.message });
      } finally {
        setLoading(false);
      }
    }
  }, [offerId, setOffer, setError, setLoading]);

  if (!offer) {
    return null;
  }

  return (
    <div className={styles["offer-wrapper"]}>
      <OfferDetails offerDetails={offer} />
    </div>
  );
};
