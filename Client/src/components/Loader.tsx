import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { loadingSliceSelectors } from "../store/slices/loading";

export const Loader = () => {
  const loading = useSelector(loadingSliceSelectors.isLoading);

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
