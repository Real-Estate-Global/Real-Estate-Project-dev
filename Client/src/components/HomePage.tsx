import { HomeOffersList } from "./HomeOffersList/HomeOffersList";
import { HeadingImage } from "./HeadingImage";
import { SearchForm } from "./SearchForm";
import { useState, useCallback, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { loadingSliceActions } from "../store/slices/loading";
import { ErrorType } from "../types/ErrorType";
import { errorSliceActions } from "../store/slices/error";
import { FiltersType } from "../types/FiltersType";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { OfferType } from "../types/OfferType";

export const HomePage = () => {
  const [offers, setOffers] = useState<OfferType[]>([]);
  const [getPublicOffers] = useGetPublicOffersMutation();
  const dispatch = useAppDispatch();
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
      getPublicOffers(null).then((result) => {
        // TODO: error handling on fetch
        if (result.data) {
          setOffers(result.data);
        }
      });
    } catch (e: any) {
      setError({ hasError: true, message: e.message });
    } finally {
      setLoading(false);
    }
  }, [getPublicOffers, setLoading, setError, setOffers]);

  const getHomeOfferList = useCallback(
    async (filters: FiltersType) => {
      try {
        setLoading(true);
        getPublicOffers(filters).then((result) => {
          // TODO: error handling on fetch
          if (result.data) {
            setOffers(result.data);
          }
        });
      } catch (e: any) {
        setError({ hasError: true, message: e.message });
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, getPublicOffers, setOffers]
  );

  return (
    <>
      <HeadingImage />
      <SearchForm getHomeOfferList={getHomeOfferList} />
      <HomeOffersList offers={offers} />
    </>
  );
}
