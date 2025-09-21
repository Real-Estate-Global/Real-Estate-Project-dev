import { useAppSelector } from "../store/hooks";
import { filtersSliceSelectors } from "../store/slices/filters";
import { useCallback, useEffect } from "react";
import { useGetPublicOffersMutation } from "../store/api/publicOffers";
import { publicOffersSliceSelectors } from "../store/slices/publicOffers";
import { NotificationManager } from "../components/Notifications";
import { FiltersType } from "../types/FiltersType";

export const useGetFilteredOffers = () => {
    const isPublicOffersLoading = useAppSelector(publicOffersSliceSelectors.isLoading);
    const isGetFiltersLoading = useAppSelector(filtersSliceSelectors.isLoading);
    const publicOffers = useAppSelector(publicOffersSliceSelectors.publicOffers);
    const [getPublicOffers] = useGetPublicOffersMutation();
    const selectedFilters = useAppSelector(filtersSliceSelectors.selectedFilters);

    const getPublicOffersAsync = useCallback(async (params: { selectedFilters: Partial<FiltersType> | null }) => {
        try {
            await getPublicOffers(params.selectedFilters)
        } catch (e) {
            NotificationManager.showSuccess({
                message: "Неуспешно взимане на оферти.",
            });
        }
    }, [])

    useEffect(() => {
        getPublicOffersAsync({ selectedFilters })
    }, [selectedFilters])

    return {
        selectedFilters,
        filteredOffers: publicOffers,
        isLoading: isPublicOffersLoading || isGetFiltersLoading
    };
};
