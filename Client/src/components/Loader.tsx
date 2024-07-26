import Spinner from "react-bootstrap/Spinner";
import { loadingSliceSelectors } from "../store/slices/loading";
import { useAppSelector } from "../store/hooks";

export const Loader = () => {
  const loading = useAppSelector(loadingSliceSelectors.isLoading);

  console.log('loading', loading)
  if (!loading) {
    return null;
  }
  return (
    <div className={`loader-wrapper ${loading ? "show-loader" : ""}`}>
      <Spinner animation="border" role="status">
        {/* <span className="visually-hidden">Loading...</span> */}
      </Spinner>
    </div>
  );
};
