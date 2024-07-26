import { useState, useEffect, useCallback } from "react";
import { OfferCard } from "../OfferCard/OfferCard";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import styles from "./MyOffers.module.css";
import { ConfirmPopup } from "../ConfirmPopup";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authSliceSelectors } from "../../store/slices/auth";
import {
  useGetMyOffersMutation,
  useDeleteOfferMutation,
} from "../../store/api/privateOffers";
import { OfferType } from "../../types/OfferType";
import { loadingSliceActions } from "../../store/slices/loading";
import { errorSliceActions } from "../../store/slices/error";
import { ErrorType } from "../../types/ErrorType";

export const MyOffers = () => {
  const dispatch = useAppDispatch();
  const [myOffers, setMyOffers] = useState<OfferType[]>([]);
  const [confirmDeletePopupState, setConfirmDeletePoupState] = useState<{
    show: boolean;
    id: null | string;
  }>({
    show: false,
    id: null,
  });
  const [getMyOffers] = useGetMyOffersMutation();
  const [deleteOffer] = useDeleteOfferMutation();
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

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
    try {
      setLoading(true);
      getMyOffers()
        .then((result) => {
          // TODO: error handling on fetch
          if (result.data) {
            setMyOffers(result.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e: any) {
      setError({ hasError: true, message: e.message });
    }
  }, [getMyOffers, setLoading, setError, setMyOffers]);

  const onConfirmDelete = useCallback(async () => {
    try {
      if (confirmDeletePopupState.id) {
        setLoading(true);
        await deleteOffer(confirmDeletePopupState.id);
        getMyOffers()
          .then((result) => {
            // TODO: error handling on fetch
            if (result.data) {
              setMyOffers(result.data);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
    }
    setConfirmDeletePoupState({ show: false, id: null });
  }, [
    confirmDeletePopupState,
    setLoading,
    deleteOffer,
    getMyOffers,
    setConfirmDeletePoupState,
  ]);

  const onCancelPopup = useCallback(() => {
    setConfirmDeletePoupState({ show: false, id: null });
  }, [setConfirmDeletePoupState]);

  if (!isAuthenticated) {
    return <div>Login please</div>;
  }

  return (
    <div className={styles["my-offers-list-wrapper"]}>
      <ConfirmPopup
        show={confirmDeletePopupState.show}
        text="Iskate li triete obqva molia??"
        onConfirm={onConfirmDelete}
        onCancel={onCancelPopup}
      />
      <h1 className={styles["my-offers-title"]}>Моите обяви</h1>
      <Button>
        <Link className={styles["add-offer-link"]} to="/createoffer">
          Добави обява
        </Link>
      </Button>
      <div className={styles["my-offers-list"]}>
        {myOffers &&
          myOffers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              editEnabled={true}
              setConfirmDeletePoupState={setConfirmDeletePoupState}
            />
          ))}
      </div>
    </div>
  );
};
