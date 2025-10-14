import React, { useState } from "react"
import { OfferType } from "../../types/OfferType"
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"
import { Galleria } from "primereact/galleria"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../store/hooks"
import { authSliceSelectors } from "../../store/slices/auth"

type Props = {
    offerData?: OfferType;
};

export const OfferPageGallery: React.FC<Props> = ({ offerData }) => {

    const [index, setIndex] = useState(0);
    const [fav, setFav] = useState(() => {
        if (typeof window === "undefined") return false;
        try { return JSON.parse(localStorage.getItem(`fav-${offerData?._id}`) || "false"); } catch { return false; }
    });

    function toggleFav() {
        // setFav(v=>{ const nv=!v; if(typeof window!=="undefined") localStorage.setItem(`fav-${offerData.id}`, JSON.stringify(nv)); return nv; });
    }

    const navigate = useNavigate()
    const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);
    const offerPhotosUrls = offerData?.images.map((img) => img.url)



    return (
        <div className="card gallery">
            <div className="overlay-top" />
            <div className="badges">
                {offerData?.isNew && <Tag value="НОВА" severity="info" rounded />}
                {offerData?.exclusive && <Tag value="ЕКСКЛУЗИВ" severity="success" rounded />}
                {/* {(offerData?.tags || []).map(t => <Tag key={t} value={t} rounded />)} */}
            </div>
            <Button className={`fav ${fav ? "active" : ""}`} rounded icon={fav ? "pi pi-bookmark-fill" : "pi pi-bookmark"} onClick={toggleFav} aria-label="Запази" />
            {isAuthenticated ? <Button className={`edit ${fav ? "active" : ""}`} rounded icon={fav ? "pi pi-pen" : "pi pi-pencil"} onClick={() => navigate(`/properties/edit/${offerData?._id}`)} aria-label="Запази" /> : ""}
            <Galleria value={offerPhotosUrls} numVisible={1} circular showThumbnails={false} showIndicators showItemNavigators activeIndex={index} onItemChange={(e) => setIndex(e.index)} item={(src) => <img src={src as string} alt={offerData.title} />} />
        </div>
    )
}