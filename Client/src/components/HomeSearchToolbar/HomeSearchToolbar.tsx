import { Toolbar } from "primereact/toolbar";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRef } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { SearchForm } from "../SearchForm/SearchForm";

type Props = {};

export const HomeSearchToolbar: React.FC<Props> = () => {
  const overlayPanelRef: any = useRef(null);

  const startContent = (
    <div className="flex flex-row flex-wrap gap-2">
      <Button
        type="button"
        label="Най-популярни"
        onClick={() => {}}
        severity="help"
        outlined
        raised
        badge={"8"}
        badgeClassName="p-badge-info"
      />
    </div>
  );

  const centerContent = (
    <>
      <IconField iconPosition="left">
        <InputIcon
          className="pi pi-search p-overlay-badge"
          onClick={(e) => overlayPanelRef?.current?.toggle(e)}
          style={{ cursor: "pointer" }}
        >
          <Badge
            value="2"
            style={{
              fontSize: "0.5rem",
              minWidth: "15px",
              minHeight: "15px",
              height: "5px",
              lineHeight: "15px",
            }}
          ></Badge>
        </InputIcon>

        <InputText
          placeholder="Бързо търсене (напр. Двустаен апартамент в София)"
          style={{ width: "600px", display: "inline-block" }}
        />
        <OverlayPanel ref={overlayPanelRef} closeOnEscape dismissable={true}>
          <SearchForm onSearch={() => {}} />
        </OverlayPanel>
      </IconField>
    </>
  );

  const endContent = <></>;

  return (
    <div>
      <div className="card">
        <Toolbar
          start={startContent}
          center={centerContent}
          end={endContent}
          style={{
            padding: "24px",
            marginLeft: "18px",
            marginRight: "18px",
            marginTop: "42px",
            marginBottom: "8px",
          }}
        />
      </div>
    </div>
  );
};
