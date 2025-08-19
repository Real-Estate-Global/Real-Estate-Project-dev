import { useParams } from "react-router-dom";
import { OfferDetails } from "../OfferDetails/OfferDetails";
import styles from "./OfferPage.module.css";
import { useGetPublicOfferQuery } from "../../store/api/publicOffers";
import { Loader } from "../Loader";
import { OfferForm } from "../OfferForm/OfferForm";
import { useCallback } from "react";
import {
  useGetMyOffersQuery,
  useDeleteOfferMutation,
  useAddNewOfferMutation,
  useEditMyOfferMutation,
} from "../../store/api/privateOffers";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";



export const CreateOfferPage = () => {
  // const { offerId } = useParams();

  const [addNewOffer, { isLoading: isAddNewOfferLoading, error: addNewOfferError }] =
    useAddNewOfferMutation();
  const { isLoading: isGetMyOffersLoading, refetch: refetchMyOffers, data: myOffers, error: getMyOffersError } = useGetMyOffersQuery();


  const onCreateNewOfferSubmit = useCallback(
    async (values: OfferType) => {
      await addNewOffer({
        ...values,
        [OfferFormDataEnum.YearOfBuilding]: values[
          OfferFormDataEnum.YearOfBuilding
        ] as Date,
      }).then(() => {
        refetchMyOffers();
        // onCreateOfferClose();
      });
    },
    // [refetchMyOffers, addNewOffer, onCreateOfferClose]
    [refetchMyOffers, addNewOffer]
  );

  return (
    <div className={styles["offer-wrapper"]}>
      {/* <Loader show={getPublicOfferQuery.isLoading} /> */}
      {/* <OfferDetails offerDetails={offer} /> */}
      <OfferForm
        onSubmit={onCreateNewOfferSubmit}
      />
    </div>
  );
};
