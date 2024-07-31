import { useCallback } from "react";
import styles from "./ErrorPopup.module.css";
import { useAppDispatch } from "../../store/hooks";
import { errorSliceActions, errorSliceSelectors } from "../../store/slices/error";
import { ErrorType } from "../../types/ErrorType";
import { useSelector } from "react-redux";

export const ErrorPopup = () => {
  const dispatch = useAppDispatch()
  const setError = useCallback((error: ErrorType) => {
    dispatch(errorSliceActions.setError(error))
  }, [dispatch])
  const error = useSelector(errorSliceSelectors.error)

  if (!error?.hasError) {
    return null;
  }

  // TODO: implement alert or use toaster
  return (
    <div className={styles["alert-wrapper"]}>
      {error?.message}
    </div>
  );
}
