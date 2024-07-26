import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { OfferDetails } from "./OfferDetails/OfferDetails.js";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authSliceSelectors } from "../store/slices/auth";
import { useGetMyOfferMutation } from "../store/api/privateOffers.js";
import { OfferType } from "../types/OfferType.js";
import { loadingSliceActions } from "../store/slices/loading.js";
import { ErrorType } from "../types/ErrorType.js";
import { errorSliceActions } from "../store/slices/error.js";

export const MyOfferPage = () => {
  const { _id } = useParams();
  const dispatch = useAppDispatch();
  const [getMyOffer] = useGetMyOfferMutation();
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

  const [myProperty, setMyProperty] = useState<OfferType | null>(null);
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
    if (_id && isAuthenticated) {
      try {
        getMyOffer(_id).then((result) => {
          if (result.data) {
            setMyProperty(result.data);
          }
        });
      } catch (e: any) {
        setError({ hasError: true, message: e.message });
      } finally {
        setLoading(false);
      }
    }
  }, [_id, isAuthenticated]);

  if (!myProperty) {
    return null;
  }
  if (!isAuthenticated) {
    return <div>Please Login</div>;
  }
  return <OfferDetails offerDetails={myProperty} />;
};
