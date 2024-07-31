import { useState, useCallback } from "react";
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
import { DateTime } from "luxon";

export const MyOffers = () => {
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
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editMyOffer, { isLoading: isEditOfferLoading }] =
    useEditMyOfferMutation();
  const getMyOffersQuery = useGetMyOffersQuery();
  const [deleteOffer, { isLoading: isDeleteOfferLoading }] =
    useDeleteOfferMutation();
  const [addNewOffer, { isLoading: isAddNewOfferLoading }] =
    useAddNewOfferMutation();
  const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

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
        getMyOffersQuery.refetch();
        onCreateOfferClose();
      });
    },
    [getMyOffersQuery, addNewOffer, onCreateOfferClose]
  );

  const onDeleteCancel = useCallback(() => {
    setDeleteDialogState({ id: null, isOpen: false });
  }, [setDeleteDialogState]);
  const onDeleteConfirm = useCallback(() => {
    if (deleteDialogState.id && !isDeleteOfferLoading) {
      deleteOffer(deleteDialogState.id).then(() => {
        getMyOffersQuery.refetch();
        onDeleteCancel();
      });
    }
  }, [
    deleteOffer,
    getMyOffersQuery,
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
          getMyOffersQuery.refetch();
          onEditOfferClose();
        });
      }
    },
    [
      isEditOfferLoading,
      getMyOffersQuery,
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

  return (
    <div>
      <Loader
        show={
          isAddNewOfferLoading || isDeleteOfferLoading || isEditOfferLoading
        }
      />
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
        <Button label="Добави Обява" onClick={onCreateOfferClick} />
      </div>
      <OfferList
        offers={getMyOffersQuery.data}
        editEnabled={true}
        onEditClick={onEditOfferClick}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
};
