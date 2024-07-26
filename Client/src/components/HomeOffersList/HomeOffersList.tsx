import { OfferCard } from "../OfferCard/OfferCard";
import styles from "./HomeOffersList.module.css";
import { OfferType } from "../../types/OfferType";
import { DataView, DataViewLayoutOptions, DataViewLayoutOptionsProps } from 'primereact/dataview'
import { ReactNode, useCallback, useState } from "react";

type Props = {
  offers: OfferType[];
};

export const HomeOffersList: React.FC<Props> = ({ offers }) => {
  const [layout, setLayout] = useState<DataViewLayoutOptionsProps["layout"]>("grid")
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

  const listTemplate = (offers: any[], layout: DataViewLayoutOptionsProps["layout"]): any => {
    return (
      <div className="grid grid-nogutter">
        {offers.map((offer) => <OfferCard key={offer._id} offer={offer} editEnabled={false} />)}
      </div>
    );
  }

  return (
    <>
      <DataView
        value={offers}
        listTemplate={listTemplate}
        layout={"grid"}
        header={header()}
      />
    </>
  )
};
