import Alert from "react-bootstrap/Alert";
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

  return (
    <div className={styles["alert-wrapper"]}>
      <Alert
        style={{ zIndex: "6" }}
        className={`${styles.alert} ${error?.hasError ? styles["show-alert"] : ""}`}
        variant={"danger"}
        onClose={() => {
          setError({ hasError: false });
        }}
        dismissible
      >
        {error?.message}
      </Alert>
    </div>
  );
}
