import React, { useMemo, useRef, useState, useEffect } from "react";
import { Galleria } from "primereact/galleria";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetPublicOfferQuery } from "../../store/api/publicOffers";
import { useAppSelector } from "../../store/hooks";
import { authSliceSelectors } from "../../store/slices/auth";
import { CreditCalculator } from "../CreditCalculator/CreditCalculator";
import { OfferPageGallery } from "../OfferPageGallery/OfferPageGallery";
import { OfferType } from "../../types/OfferType";


interface Listing {
    id: string;
    title: string;
    priceEUR: number;
    address: string;
    city: string;
    district: string;
    areaM2: number;
    rooms: number;
    baths: number;
    floor?: string;
    year?: number;
    type: string;
    images: string[];
    tags?: string[];
    exclusive?: boolean;
    isNew?: boolean;
    description: string;
    features: string[];
}

const STYLE_ID = "listing-detail-prime-light-v6";

function useEnsureCss() {
    useEffect(() => {
        if (!document.getElementById(STYLE_ID)) {
            //   const s=document.createElement("style"); s.id=STYLE_ID; s.textContent={"./styles/offerPageChatGPT.css"}; document.head.appendChild(s);
        }
        const links: [string, string][] = [
            ["primeicons-link", "https://unpkg.com/primeicons/primeicons.css"],
            ["primereact-core", "https://unpkg.com/primereact/resources/primereact.min.css"],
            ["primereact-theme", "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css"],
        ];
        links.forEach(([id, href]) => {
            if (!document.getElementById(id)) {
                const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
            }
        });
    }, []);
}

function useCurrency() {
    return useMemo(() => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR" }), []);
}

export const OfferPageChatGPT = () => {

    type Props = {
        // offer: OfferType;
        // editEnabled?: boolean;
        // onEditClick?: (id: string, values: OfferType) => void;
        // onDeleteClick?: (id: string) => void;
    };

    const isAuthenticated = useAppSelector(authSliceSelectors.isAuthenticated);

    const { offerId } = useParams();
    const getPublicOfferQuery = useGetPublicOfferQuery(offerId as string);
    const offerData = getPublicOfferQuery.data
    // return (offer)
    console.log("IMPORTANT", offerData)

    let euro = Intl.NumberFormat('en-DE', {
        style: 'currency',
        currency: 'EUR',
        // maximumSignificantDigits: 6,
        maximumFractionDigits: 0
    });


    useEnsureCss();
    const toast = useRef<Toast>(null);
    const fmt = useCurrency();
    const [fav, setFav] = useState(() => {
        if (typeof window === "undefined") return false;
        try { return JSON.parse(localStorage.getItem(`fav-${offerData?._id}`) || "false"); } catch { return false; }
    });
    const [index, setIndex] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatText, setChatText] = useState("");
    const [messages, setMessages] = useState<{ me?: boolean; text: string; time: string }[]>([
        { text: "Здравейте! Интересувам се от този имот.", time: new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" }) }
    ]);

    // const pricePerM2 = Math.round(offerData.priceEUR / offerData.areaM2);
    console.log("offerDATAAA", euro.format(Number(offerData?.price)))
    const pricePerM2 = Math.round((Number(offerData?.price)) / Number(offerData?.area));

    function toggleFav() {
        // setFav(v=>{ const nv=!v; if(typeof window!=="undefined") localStorage.setItem(`fav-${offerData.id}`, JSON.stringify(nv)); return nv; });
    }
    function sendMessage() {
        if (!chatText.trim()) return;
        const now = new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" });
        setMessages(prev => [...prev, { me: true, text: chatText.trim(), time: now }]);
        setChatText("");
        toast.current?.show({ severity: "success", summary: "Изпратено", life: 1800 });
    }

    const offerPhotosUrls = offerData?.images.map((img) => img.url)

    const roomsToName: { [key: string]: string } = {
        1: "Едностаен",
        2: "Двустаен",
        3: "Тристаен",
        4: "Многостаен",
    }

    const navigate = useNavigate()
    console.log("testets", offerData)
    // console.log("testetcbsjhdcbss", OfferType)

    return (
        <div className="offer-page-new">
            {/* <Toast ref={toast} /> */}
            {/* <header className="header">
                <div className="container header-inner">
                    <div className="logo"><span className="dot" /> Acme Estates</div>
                    <nav style={{ display: "flex", gap: 8 }}>
                        <Button label="Купи" text />
                        <Button label="Наеми" text />
                        <Button label="Пусни обява" icon="pi pi-plus" />
                    </nav>
                </div>
            </header> */}

            <main className="container" style={{ marginTop: 16 }}>
                <div className="card gallery">
                    <div className="overlay-top" />
                    <div className="badges">
                        {offerData?.isNew && <Tag value="НОВА" severity="info" rounded />}
                        {offerData?.exclusive && <Tag value="ЕКСКЛУЗИВ" severity="success" rounded />}
                        {(offerData?.tags || []).map(t => <Tag key={t} value={t} rounded />)}
                    </div>
                    <Button className={`fav ${fav ? "active" : ""}`} rounded icon={fav ? "pi pi-bookmark-fill" : "pi pi-bookmark"} onClick={toggleFav} aria-label="Запази" />
                    {isAuthenticated ? <Button className={`edit ${fav ? "active" : ""}`} rounded icon={fav ? "pi pi-pen" : "pi pi-pencil"} onClick={() => navigate(`/properties/edit/${offerData?._id}`)} aria-label="Запази" /> : ""}
                    <Galleria value={offerPhotosUrls} numVisible={1} circular showThumbnails={false} showIndicators showItemNavigators activeIndex={index} onItemChange={(e) => setIndex(e.index)} item={(src) => <img src={src as string} alt={offerData.title} />} />
                </div>
                {/* <OfferPageGallery offerData={offerData} /> */}

                <section className="main" style={{ marginTop: 16 }}>
                    <article className="card pad content" aria-label="Основна информация">
                        <div className="title">
                            <div>
                                {/* <h1 className="h1">{`${roomsToName[String(offerData?.rooms)] ? roomsToName[String(offerData?.rooms)] : "Многостаен" offerData?.propertyType.toLocaleLowerCase()} в {offerData?.district}}` || `${DEMO.title}` || "hello"}</h1> */}
                                <h1 className="h1"> {`${roomsToName[String(offerData?.rooms)] ? roomsToName[String(offerData?.rooms)] : "Многостаен"} ${offerData?.propertyType.toLocaleLowerCase()} в ${offerData?.district}`} </h1>
                                <div className="sub">{offerData?.location}, {offerData?.district} • {offerData?.address ? offerData?.address : "ул. Лятно кокиче 12"} • ID: {offerData?._id}</div>
                                <div className="specs" style={{ marginTop: 8 }}>
                                    <Tag icon="pi pi-home" value={offerData?.propertyType} />
                                    <Tag icon="pi pi-expand" value={`${offerData?.area} м²`} />
                                    <Tag icon="pi pi-table" value={`${offerData?.rooms} стаи`} />
                                    {/* <Tag icon="pi-bath" value={`${offerData?.baths || 2} бани`} /> */}
                                    {offerData?.floor && <Tag icon="pi pi-sort-numeric-up" value={`Етаж ${offerData?.floor}`} />}
                                    {offerData?.yearOfBuilding && <Tag icon="pi pi-calendar" value={`${new Date(offerData.yearOfBuilding).getFullYear()}`} />}
                                </div>
                            </div>
                            <div className="pricebox">
                                <div className="price">{fmt.format(Number(offerData?.price))}</div>
                                <div className="sub">≈ € {pricePerM2 || 10000}/м²</div>
                                <div className="actions">
                                    <Button icon="pi pi-share-alt" rounded text aria-label="Сподели" onClick={() => navigator?.share?.({ title: offerData?.title ? offerData?.title : "test", url: location.href }).catch(() => { })} />
                                    <Button icon="pi pi-link" rounded text aria-label="Копирай линк" onClick={() => { navigator.clipboard?.writeText(location.href); toast.current?.show({ severity: "info", summary: "Линк копиран", life: 2000 }); }} />
                                    <Button icon="pi pi-whatsapp" rounded text aria-label="Сподели WhatsApp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(offerData.title + " " + location.href)}`, '_blank')} />
                                </div>
                            </div>
                        </div>
                        <Divider />

                        <div className="stack">
                            <h3 className="section-title"><i className="pi pi-info-circle" style={{ marginRight: 8 }} />Описание</h3>
                            <p className="sub" style={{ margin: 0 }}>{offerData?.description}</p>
                            <Divider />
                            <h3 className="section-title"><i className="pi pi-list-check" style={{ marginRight: 8 }} />Особености</h3>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <Tag icon="pi pi-sort" value="Асансьор" />
                                <Tag icon="pi pi-car" value="Паркинг" />
                                <Tag icon="pi pi-shield" value="Контролиран достъп" />
                                <Tag icon="pi pi-box" value="Склад" />
                                <Tag icon="pi pi-sun" value="ТЕЦ" />
                                <Tag icon="pi pi-refresh" value="Климатизация" />
                            </div>
                            <Divider />
                            <h3 className="section-title"><i className="pi pi-images" style={{ marginRight: 8 }} />План</h3>
                            <div className="planph">План на имота (плейсхолдър)</div>
                            <Divider />
                            <h3 className="section-title"><i className="pi pi-map-marker" style={{ marginRight: 8 }} />Локация</h3>
                            <div className="mapph">
                                <iframe
                                    src={`https://www.google.com/maps?q=${offerData?.district ? offerData?.district : offerData?.location}&output=embed`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: "10px" }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                            <Divider />
                            <h3 className="section-title"><i className="pi pi-calculator" style={{ marginRight: 8 }} />Финанси</h3>
                            {/* <MortgageCalculator price={Number(offerData?.price)} /> */}
                            <CreditCalculator price={Number(offerData?.price)} />
                            <Divider />
                            <h3 className="section-title"><i className="pi pi-file" style={{ marginRight: 8 }} />Документи</h3>
                            <ul style={{ margin: "6px 0" }}>
                                <li>Скица на имота (налично)</li>
                                <li>Акт 16 (налично)</li>
                                <li>Енергиен паспорт (по заявка)</li>
                            </ul>
                        </div>
                    </article>

                    <aside className="aside">
                        <section className="card pad" aria-label="Агент">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Avatar label="ГК" size="large" shape="circle" />
                                <div>
                                    <strong>Гергана Костова</strong>
                                    <div className="sub">Лицензиран брокер</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                <Button icon="pi pi-phone" label="Обади се" onClick={() => window.open("tel:+359888123456")} />
                                {/* <Button icon="pi pi-envelope" label="Пиши" onClick={() => window.open("mailto:agent@example.com?subject=Запитване:" + encodeURIComponent(offerData?.title || "test title"))} /> */}
                            </div>
                        </section>

                        <section className="card pad" aria-label="Запитване">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <strong>Изпрати съобщение</strong>
                                <InputText placeholder="Име" />
                                <InputText placeholder="Телефон" keyfilter="int" />
                                <InputText placeholder="Имейл" />
                                <InputTextarea autoResize rows={3} placeholder="Вашето запитване…" />
                                <Button label="Изпрати" icon="pi pi-send" onClick={() => toast.current?.show({ severity: "success", summary: "Изпратено", life: 1800 })} />
                            </div>
                        </section>
                    </aside>
                </section>
            </main>

            <div className="chat-fab" style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 70 }}>
                <Button rounded raised size="large" icon="pi pi-comments" aria-label="Чат" onClick={() => setChatOpen(true)} />
            </div>

            <Sidebar visible={chatOpen} position="right" onHide={() => setChatOpen(false)} header={<span><i className="pi pi-comments" style={{ marginRight: 8 }} />Чат с агент</span>} style={{ width: 360 }}>
                <div style={{ display: "flex", flexDirection: 'column', height: "100%", gap: 8 }}>
                    <div style={{ overflowY: "auto", display: "flex", flexDirection: 'column', gap: 8 }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                                <div style={{ background: m.me ? "#dcfce7" : "#f1f5f9", color: "#0f172a", padding: "8px 10px", borderRadius: 12, border: "1px solid #e2e8f0" }}>{m.text}</div>
                                <small className="sub" style={{ display: "block", marginTop: 2, textAlign: m.me ? "right" : "left" }}>{m.time}</small>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <InputText style={{ flex: '1 1 auto' }} placeholder="Вашето съобщение…" value={chatText} onChange={(e) => setChatText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
                        <Button icon="pi pi-send" onClick={sendMessage} />
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}
