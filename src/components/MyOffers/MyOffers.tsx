import { useState, useCallback, useEffect } from "react";
import { Button } from "primereact/button";
import styles from "./MyOffers.module.css";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useAppSelector } from "../../store/hooks";
import { authSliceSelectors } from "../../store/slices/auth";
import {
  useGetMyOffersQuery,
  useDeleteOfferMutation,
  useAddNewOfferMutation,
  useEditMyOfferMutation,
} from "../../store/api/privateOffers";
import { OfferFormDataEnum, OfferType } from "../../types/OfferType";
import { OfferList } from "../OfferList/OfferList";
import { Loader } from "../Loader";
import { OfferFormDialog } from "../OfferForm/OfferFormDialog";
import { useNavigate } from "react-router-dom";

type Props = {
  onGetProfileData: () => void;
}
export const MyOffers = ({ onGetProfileData }: Props) => {
  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const [editDialogState, setEditDialogState] = useState<{
    isOpen: boolean;
    id: string | null;
    initialValues?: OfferType | null;
  }>({
    isOpen: false,
    id: null,
    initialValues: null,
  });
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

  const { isLoading: isGetMyOffersLoading, refetch: refetchMyOffers, data: myOffers, error: getMyOffersError } = useGetMyOffersQuery();
  const [editMyOffer, { isLoading: isEditOfferLoading, error: editOfferError }] =
    useEditMyOfferMutation();
  const [deleteOffer, { isLoading: isDeleteOfferLoading, error: deleteOfferError }] =
    useDeleteOfferMutation();
  const [addNewOffer, { isLoading: isAddNewOfferLoading, error: addNewOfferError }] =
    useAddNewOfferMutation();
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  const isLoading = isGetMyOffersLoading || isAddNewOfferLoading || isDeleteOfferLoading || isEditOfferLoading

  useEffect(() => {
    onGetProfileData();
  }, [])
  const onCreateOfferClick = useCallback(() => {
    setCreateDialogOpen(true);
  }, [setCreateDialogOpen]);
  const onCreateOfferClose = useCallback(() => {
    setCreateDialogOpen(false);
  }, [setCreateDialogOpen]);
  const onCreateNewOfferSubmit = useCallback(
    async (values: OfferType) => {
      await addNewOffer({
        ...values,
        [OfferFormDataEnum.YearOfBuilding]: values[
          OfferFormDataEnum.YearOfBuilding
        ] as Date,
      }).then(() => {
        refetchMyOffers();
        onCreateOfferClose();
      });
    },
    [refetchMyOffers, addNewOffer, onCreateOfferClose]
  );

  const onDeleteCancel = useCallback(() => {
    setDeleteDialogState({ id: null, isOpen: false });
  }, [setDeleteDialogState]);
  const onDeleteConfirm = useCallback(() => {
    if (deleteDialogState.id && !isDeleteOfferLoading) {
      deleteOffer(deleteDialogState.id).then(() => {
        refetchMyOffers();
        onDeleteCancel();
      });
    }
  }, [
    deleteOffer,
    refetchMyOffers,
    deleteDialogState.id,
    isDeleteOfferLoading,
    onDeleteCancel,
  ]);
  const onDeleteClick = useCallback(
    (id: string) => {
      setDeleteDialogState({ id, isOpen: true });
    },
    [setDeleteDialogState]
  );

  const onEditOfferClose = useCallback(() => {
    setEditDialogState({ id: null, isOpen: false, initialValues: null });
  }, [setEditDialogState]);

  const onEditOfferSubmit = useCallback(
    async (newValues: OfferType) => {
      if (editDialogState.id && !isEditOfferLoading) {
        await editMyOffer({
          id: editDialogState.id,
          editOfferData: newValues,
        }).then(() => {
          refetchMyOffers();
          onEditOfferClose();
        });
      }
    },
    [
      isEditOfferLoading,
      refetchMyOffers,
      editDialogState.id,
      editMyOffer,
      onEditOfferClose,
    ]
  );
  const onEditOfferClick = useCallback(
    (id: string, values: OfferType) => {
      setEditDialogState({
        isOpen: true,
        id,
        initialValues: values,
      });
    },
    [setEditDialogState]
  );

  // TODO: better login prompt
  if (!isAuthenticated) {
    return <div>Login please</div>;
  }

  const navigate = useNavigate(); 

  return (
    <div>
      <Loader show={isLoading} />
      {deleteDialogState.isOpen && (
        <ConfirmDialog
          visible={deleteDialogState.isOpen}
          onHide={onDeleteCancel}
          message="Искате ли да изтриете тази обява?"
          header="Моля потвърдете"
          icon="pi pi-exclamation-triangle"
          accept={onDeleteConfirm}
          reject={onDeleteCancel}
        />
      )}
      {createDialogOpen && (
        <OfferFormDialog
          show={createDialogOpen}
          onClose={onCreateOfferClose}
          onSubmit={onCreateNewOfferSubmit}
        />
      )}
      {editDialogState.isOpen && (
        <OfferFormDialog
          show={editDialogState.isOpen}
          initialFormValues={editDialogState.initialValues}
          onClose={onEditOfferClose}
          onSubmit={onEditOfferSubmit}
        />
      )}

      <div className={styles["my-offers-list-wrapper"]}>
        <h1 className={styles["my-offers-title"]}>Моите обяви</h1>
        {/* <Button label="Добави Обява" onClick={onCreateOfferClick} /> */}
        <Button label="Добави Обява" onClick={() => navigate("/properties/create-new-offer")} />
      </div>
      <OfferList
        offers={myOffers}
        editEnabled={isAuthenticated}
        onEditClick={onEditOfferClick}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
};
