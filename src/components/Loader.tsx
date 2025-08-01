import { ProgressSpinner } from "primereact/progressspinner";
import { loadingSliceSelectors } from "../store/slices/loading";
import { useAppSelector } from "../store/hooks";

export const Loader = ({ show }: { show?: boolean }) => {
  const loading = useAppSelector(loadingSliceSelectors.isLoading);

  if (!loading && !show) {
    return null;
  }
  return (
    <div className={`loader-wrapper ${loading || show ? "show-loader" : ""}`  }>
      <ProgressSpinner
        color="cyan"
        aria-label="Loader"
        animationDuration=".5s"
      ></ProgressSpinner>
    </div>
  );
};
