import { OfferCard } from "../OfferCard/OfferCard";
import { OfferType } from "../../types/OfferType";
import {
  DataView,
  DataViewLayoutOptions,
  DataViewLayoutOptionsProps,
} from "primereact/dataview";
import { useState } from "react";

type Props = {
  offers?: OfferType[];
  editEnabled?: boolean;
  onDeleteClick?: (id: string) => void;
  onEditClick?: (id: string, values: OfferType) => void;
  onGetProfileData: () => void;
};

export const OfferList: React.FC<Props> = ({
  offers,
  editEnabled = false,
  onEditClick,
  onDeleteClick,
  onGetProfileData,
}) => {

  const [layout, setLayout] =
    useState<DataViewLayoutOptionsProps["layout"]>("grid");
  const header = () => {
    return (
      <div className="flex justify-content-end">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  const listTemplate = (
    offers: any[],
    layout: DataViewLayoutOptionsProps["layout"]
  ): any => {
    return (
      <div className="grid grid-nogutter">
        {offers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            editEnabled={editEnabled}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onGetProfileData={onGetProfileData}
          />
        ))}
      </div>
    );
  };

  if (!offers) {
    return null;
  }

  return (
    <>
      <DataView
        value={offers}
        listTemplate={listTemplate}
        layout={"grid"}
        header={header()}
        className="offer-list"
      />
    </>
  );
};
