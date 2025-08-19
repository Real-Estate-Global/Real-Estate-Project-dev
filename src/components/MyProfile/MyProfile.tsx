import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Chips } from "primereact/chips";
import { InputSwitch } from "primereact/inputswitch";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Rating } from "primereact/rating";
import { ProgressBar } from "primereact/progressbar";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";

const STYLE_ID = "profile-prime-icons-inline-v1";
const CSS_TEXT = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400..700&display=swap');
.profile-page{ --bg:#f8fafc; --surface:#ffffff; --muted:#64748b; --text:#0f172a; --primary:#3858CF; --border:#e2e8f0; --ring:rgba(56,88,207,.28); background:var(--bg); color:var(--text); font-family:"Comfortaa", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; overflow-x:hidden }
.profile-page *{ box-sizing:border-box; min-width:0 }
.profile-page img{ max-width:100%; height:auto }
.profile-page .container{ width:min(1200px,100vw); margin-inline:auto; padding-inline:12px }
.profile-page .header{ position:sticky; top:0; z-index:60; backdrop-filter:saturate(1.1) blur(8px); background:color-mix(in oklab, var(--bg), transparent 25%); border-bottom:1px solid var(--border) }
.profile-page .header-inner{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 0 }
.profile-page .logo{ display:flex; gap:10px; align-items:center; font-weight:900 }
.profile-page .logo .dot{ width:12px; height:12px; border-radius:999px; background:linear-gradient(180deg, color-mix(in oklab, var(--primary), #fff 25%), var(--primary)) }

.profile-page .main{ display:grid; grid-template-columns: clamp(240px,28vw,320px) minmax(0,1fr); gap:18px; align-items:start; min-height:0 }
.profile-page .card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; box-shadow:0 10px 24px rgba(2,6,23,.06) }
.profile-page .pad{ padding:16px }
/* Sticky only on desktop */
.profile-page .sticky{ position:static }
@media (min-width: 981px){ .profile-page .sticky{ position:sticky; top:86px } }

.profile-page .hero{ padding:22px 0 10px }
.profile-page .hero h1{ margin:0; font-size: clamp(22px, 3vw, 34px); word-break:break-word }
.profile-page .sub{ color:var(--muted) }

.profile-page .profile-head{ display:grid; grid-template-columns: 72px 1fr; gap:12px; align-items:center }
.profile-page .stats{ display:grid; grid-template-columns: repeat(3,1fr); gap:10px; margin-top:10px }
.profile-page .stat{ background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:12px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:6px; min-height:104px }
.profile-page .stat .label{ font-size:12px; color:var(--muted) }
.profile-page .stat .value{ font-weight:900; font-size:18px }

.profile-page .actions{ display:flex; gap:10px; flex-wrap:wrap }
.profile-page .section-title{ font-size:18px; margin: 6px 0 }
.profile-page .field{ display:flex; flex-direction:column; gap:6px }
.profile-page .field label{ font-size:12px; letter-spacing:.2px; color:var(--muted); display:flex; align-items:center; gap:6px }
.profile-page .row{ display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:12px }
.profile-page .full{ grid-column: 1 / -1 }

.profile-page .pill{ font-size:12px; padding:6px 10px; border-radius:999px; border:1px solid var(--border); background:#fff; white-space:nowrap; display:inline-flex; align-items:center; gap:6px }
.profile-page .kv{ display:grid; grid-template-columns: 1fr auto; gap:8px; align-items:center }
.profile-page .kv-line{ display:grid; grid-template-columns: 18px 1fr; align-items:center; gap:8px; color:var(--muted) }

.profile-page .table-wrap{ overflow:auto; max-width:100% }
.profile-page .list-img{ width:72px; height:54px; object-fit:cover; border-radius:8px; border:1px solid var(--border) }

.profile-page .quota{ display:grid; grid-template-columns:1fr; align-items:center; gap:6px }

/* PrimeReact tab overflow fix on small screens */
.profile-page .p-tabview-nav-content{ overflow:auto }
.profile-page .p-tabview-nav{ flex-wrap:nowrap }

/* Docs grid */
.profile-page .docs-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:12px }

@media (max-width: 980px){
  .profile-page .main{ grid-template-columns: 1fr }
  .profile-page .row{ grid-template-columns: 1fr }
  .profile-page .stats{ grid-template-columns: 1fr 1fr }
}
@media (max-width: 560px){
  .profile-page .stats{ grid-template-columns: 1fr }
  .profile-page .docs-grid{ grid-template-columns: 1fr 1fr }
}
@media (max-width: 380px){
  .profile-page .docs-grid{ grid-template-columns: 1fr }
}
`;

function useEnsureCss() {
    useEffect(() => {
        const links: [string, string][] = [
            ["primereact-core", "https://unpkg.com/primereact/resources/primereact.min.css"],
            ["primereact-theme", "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css"],
            ["comfortaa-font", "https://fonts.googleapis.com/css2?family=Comfortaa:wght@400..700&display=swap"],
        ];
        links.forEach(([id, href]) => { if (!document.getElementById(id)) { const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = href; l.crossOrigin = "anonymous"; l.referrerPolicy = "no-referrer"; document.head.appendChild(l); } });
        if (!document.getElementById(STYLE_ID)) {
            const s = document.createElement("style"); s.id = STYLE_ID; s.textContent = CSS_TEXT; document.head.appendChild(s);
        }
    }, []);
}

function useCurrency() {
    return useMemo(() => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }), []);
}

type ListingRow = { id: string; title: string; price: number; status: "Публикувана" | "Чернова" | "Скрита"; views: number; district: string; created: string; image: string };

type ReviewRow = { id: string; user: string; rating: number; text: string; date: string };

type IconName =
    | "verified" | "briefcase" | "star" | "star-fill" | "clock" | "calendar" | "user-edit" | "plus-circle"
    | "wallet" | "list" | "images" | "arrow-up-right" | "eye" | "pencil" | "eye-slash" | "times"
    | "save" | "bell" | "comments" | "arrow-down" | "send" | "user" | "file" | "folder-open"
    | "info" | "shield" | "lock" | "key" | "map-marker" | "globe" | "id-card" | "comment" | "building" | "link" | "phone";

function Icon({ name, size = 18, className, style }: { name: IconName; size?: number; className?: string; style?: React.CSSProperties }) {
    const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
    switch (name) {
        case "verified": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M12 3l2.6 1.5 3-.4 1.4 2.7 2.6 1.5-.6 3 1 3-2.7 1.4-1.4 2.7-3-.6L12 21l-2.6-1.5-3 .6-1.4-2.7L1 14l1-3-.6-3L4 6.8 5.4 4 8.4 4.5 12 3z" /><path {...common} d="M9 12l2 2 4-4" /></svg>);
        case "briefcase": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="3" y="7" width="18" height="13" rx="2" /><path {...common} d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>);
        case "star": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M12 17.3L6.2 20l1.1-6.4L2 8.9l6.5-.9L12 2l3.5 6 6.5.9-4.7 4.7 1.1 6.4z" /></svg>);
        case "star-fill": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path d="M12 17.3L6.2 20l1.1-6.4L2 8.9l6.5-.9L12 2l3.5 6 6.5.9-4.7 4.7 1.1 6.4z" fill="currentColor" /></svg>);
        case "clock": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 7v5l3 3" /></svg>);
        case "calendar": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="3" y="5" width="18" height="16" rx="2" /><path {...common} d="M16 3v4M8 3v4M3 11h18" /></svg>);
        case "user-edit": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="12" cy="7" r="4" /><path {...common} d="M5.5 21a7.5 7.5 0 0 1 13 0" /><path {...common} d="M18 13l3 3-5 5h-3v-3z" /></svg>);
        case "plus-circle": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M12 8v8M8 12h8" /></svg>);
        case "wallet": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="3" y="6" width="18" height="14" rx="2" /><path {...common} d="M16 10h5v6h-5a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" /></svg>);
        case "list": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r="1.5" fill="currentColor" /><circle cx="3.5" cy="12" r="1.5" fill="currentColor" /><circle cx="3.5" cy="18" r="1.5" fill="currentColor" /></svg>);
        case "images": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><path {...common} d="M8 13l3-3 5 5" /><circle {...common} cx="8.5" cy="9.5" r="1.5" /></svg>);
        case "arrow-up-right": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M7 17L17 7M9 7h8v8" /></svg>);
        case "eye": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle {...common} cx="12" cy="12" r="3" /></svg>);
        case "pencil": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M3 21l3-1 11-11-2-2L4 18l-1 3z" /><path {...common} d="M14 4l2 2" /></svg>);
        case "eye-slash": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M3 3l18 18" /><path {...common} d="M1 12s4-7 11-7c2.2 0 4 .6 5.6 1.4M23 12s-4 7-11 7c-2.2 0-4-.6-5.6-1.4" /></svg>);
        case "times": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M6 6l12 12M6 18L18 6" /></svg>);
        case "save": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M5 21h14a2 2 0 0 0 2-2V7l-4-4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" /><path {...common} d="M17 21v-8H7v8" /><path {...common} d="M7 3v5h8" /></svg>);
        case "bell": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path {...common} d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);
        case "comments": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>);
        case "arrow-down": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M12 5v14M19 12l-7 7-7-7" /></svg>);
        case "send": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M22 2L11 13" /><path {...common} d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>);
        case "user": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="12" cy="7" r="4" /><path {...common} d="M5.5 21a7.5 7.5 0 0 1 13 0" /></svg>);
        case "file": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path {...common} d="M14 2v6h6" /></svg>);
        case "folder-open": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M3 7h5l2 3h11a2 2 0 0 1 2 2l-2 6a2 2 0 0 1-2 1H5a2 2 0 0 1-2-2z" /></svg>);
        case "info": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="12" cy="12" r="10" /><path {...common} d="M12 16v-4M12 8h.01" /></svg>);
        case "shield": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" /></svg>);
        case "lock": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="4" y="11" width="16" height="10" rx="2" /><path {...common} d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>);
        case "key": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="7" cy="12" r="3" /><path {...common} d="M10 12h11l-3 3 3 3" /></svg>);
        case "map-marker": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M12 22s7-5 7-11a7 7 0 1 0-14 0c0 6 7 11 7 11z" /><circle {...common} cx="12" cy="11" r="3" /></svg>);
        case "globe": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><circle {...common} cx="12" cy="12" r="9" /><path {...common} d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>);
        case "id-card": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="3" y="5" width="18" height="14" rx="2" /><circle {...common} cx="8" cy="12" r="2" /><path {...common} d="M12 12h6M12 16h6" /></svg>);
        case "comment": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg>);
        case "building": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><rect {...common} x="3" y="3" width="18" height="18" rx="2" /><path {...common} d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v5h-3z" /></svg>);
        case "link": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1" /><path {...common} d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1" /></svg>);
        case "phone": return (<svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style}><path {...common} d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1" /><path {...common} d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1" /></svg>);
        default: return null as any;
    }
}

export const MyProfile = () => {
    useEnsureCss();
    const fmt = useCurrency();
    const toast = useRef<Toast>(null);

    const [profile, setProfile] = useState({
        fullName: "Мария Иванова",
        email: "maria@example.com",
        phone: "+359 888 333 222",
        role: "Брокер",
        agency: "Acme Estates",
        description: "Помагам на хората да намират мечтания дом в София. Специалист по южни квартали и ново строителство.",
        languages: ["Български", "Английски"],
        serviceAreas: ["Лозенец", "Манастирски ливади", "Хладилника"],
        website: "https://acme-estates.example",
    });
    const roles = ["Брокер", "Собственик", "Агенция"].map(v => ({ label: v, value: v }));
    const langs = ["Български", "Английски", "Руски", "Немски", "Френски"].map(v => ({ label: v, value: v }));

    const [notif, setNotif] = useState({ newMessages: true, priceDrops: true, newsletter: false });

    const [listings, setListings] = useState<ListingRow[]>([
        { id: "LOZ-3217", title: "3-стаен с панорама", price: 289000, status: "Публикувана", views: 842, district: "Лозенец", created: "2025-03-18", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop" },
        { id: "MS-114", title: "2-стаен до мол Парадайс", price: 189000, status: "Чернова", views: 0, district: "Хладилника", created: "2025-07-05", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop" },
        { id: "VL-88", title: "Къща с двор 520 м²", price: 499000, status: "Скрита", views: 122, district: "Витоша", created: "2025-02-02", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop" },
    ]);

    const [saved, setSaved] = useState<ListingRow[]>([
        { id: "CENT-23", title: "Мезонет на 2 нива", price: 359000, status: "Публикувана", views: 0, district: "Център", created: "2025-06-11", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800&auto=format&fit=crop" },
    ]);

    const [reviews] = useState<ReviewRow[]>([
        { id: "r1", user: "Иво П.", rating: 5, text: "Страхотна комуникация и професионализъм!", date: "2025-05-20" },
        { id: "r2", user: "Деси Г.", rating: 4, text: "Бърза реакция, полезни съвети.", date: "2025-04-02" },
    ]);

    const [rating] = useState(4.8);
    const [responseTime] = useState("~15 мин.");
    const [joined] = useState("януари 2024");

    const [plan] = useState({ name: "Pro", listingsQuota: 25, listingsUsed: 12, photosPerListing: 40, expires: "2026-01-10" });
    const [docs, setDocs] = useState<string[]>([]);

    function saveProfile() { toast.current?.show({ severity: "success", summary: "Записано", life: 1800 }); }
    function saveNotif() { toast.current?.show({ severity: "success", summary: "Настройките са записани", life: 1800 }); }

    function deleteListing(row: ListingRow) {
        confirmDialog({
            message: `Да скрием ли обявата ${row.id}?`, header: "Потвърдете", accept: () => {
                setListings(prev => prev.map(l => l.id === row.id ? { ...l, status: "Скрита" } : l));
                toast.current?.show({ severity: "info", summary: "Скрито", life: 1600 });
            }
        });
    }

    function uploadDocs(e: FileUploadHandlerEvent) {
        const urls = Array.from(e.files || []).map(f => URL.createObjectURL(f));
        setDocs(prev => [...urls, ...prev]);
        toast.current?.show({ severity: "success", summary: "Документи качени", life: 1800 });
    }

    const fmtDate = (s: string) => new Date(s).toLocaleDateString("bg-BG");

    return (
        <div className="profile-page">
            <Toast ref={toast} />
            <ConfirmDialog />
            <header className="header">
                <div className="container header-inner">
                    <div className="logo"><span className="dot" /> Acme Estates</div>
                    <div className="sub">Профил и настройки</div>
                </div>
            </header>

            <main className="container">
                <section className="hero">
                    <h1>Моят профил</h1>
                    <p className="sub">Управлявайте личните данни, обявите, абонамента и предпочитанията си.</p>
                </section>

                <section className="main">
                    <aside className="sticky">
                        <Card className="card pad">
                            <div className="profile-head">
                                <Avatar label="МИ" size="large" shape="circle" style={{ background: "#e2e8f0", color: "#0f172a" }} />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <strong>{profile.fullName}</strong>
                                        <Tag value={<><Icon name="verified" style={{ marginRight: 6 }} />Потвърден профил</>} rounded />
                                    </div>
                                    <div className="sub"><Icon name="briefcase" style={{ marginRight: 6 }} /> {profile.role} • {profile.agency}</div>
                                </div>
                            </div>
                            <div className="stats">
                                <div className="stat"><Icon name="star-fill" /><div className="value">{rating}</div><div className="label">Рейтинг</div></div>
                                <div className="stat"><Icon name="clock" /><div className="value">{responseTime}</div><div className="label">Време за отговор</div></div>
                                <div className="stat"><Icon name="calendar" /><div className="value">{joined}</div><div className="label">От</div></div>
                            </div>
                            <Divider />
                            <div className="actions">
                                <Button icon={<Icon name="user-edit" />} label="Редактирай профил" onClick={() => { }} />
                                <Button icon={<Icon name="plus-circle" />} label="Нова обява" severity="secondary" onClick={() => toast.current?.show({ severity: 'info', summary: 'Създаване на обява' })} />
                            </div>
                        </Card>

                        <Card className="card pad" style={{ marginTop: 12 }}>
                            <div className="kv"><strong><Icon name="wallet" style={{ marginRight: 6 }} />План</strong><span className="pill"><Icon name="star" /> {plan.name}</span></div>
                            <Divider />
                            <div className="quota">
                                <div className="kv-line"><Icon name="list" /><span>Обяви: {plan.listingsUsed}/{plan.listingsQuota}</span></div>
                                <div className="kv-line"><Icon name="images" /><span>Лимит снимки: {plan.photosPerListing}</span></div>
                            </div>
                            <ProgressBar value={Math.round((plan.listingsUsed / plan.listingsQuota) * 100)} style={{ marginTop: 8 }} />
                            <div className="sub" style={{ marginTop: 8 }}><Icon name="calendar" style={{ marginRight: 6 }} />Валиден до: {fmtDate(plan.expires)}</div>
                            <div className="actions" style={{ marginTop: 10 }}>
                                <Button icon={<Icon name="wallet" />} label="Управлявай абонамента" />
                                <Button icon={<Icon name="arrow-up-right" />} label="Надгради" severity="success" />
                            </div>
                        </Card>
                    </aside>

                    <section>
                        <Card className="card pad">
                            <TabView>
                                <TabPanel header={<span><Icon name="user" style={{ marginRight: 8 }} />Профил</span>}>
                                    <div className="row">
                                        <div className="field"><label><Icon name="id-card" style={{ marginRight: 6 }} />Име и фамилия</label><InputText value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} /></div>
                                        <div className="field"><label><Icon name="briefcase" style={{ marginRight: 6 }} />Роля</label><Dropdown value={profile.role} options={roles} onChange={e => setProfile(p => ({ ...p, role: e.value }))} placeholder="Изберете" /></div>
                                        <div className="field"><label><Icon name="link" style={{ marginRight: 6 }} />Имейл</label><InputText value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></div>
                                        <div className="field"><label><Icon name="phone" style={{ marginRight: 6 }} />Телефон</label><InputText value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
                                        <div className="field"><label><Icon name="building" style={{ marginRight: 6 }} />Агенция</label><InputText value={profile.agency} onChange={e => setProfile(p => ({ ...p, agency: e.target.value }))} /></div>
                                        <div className="field"><label><Icon name="link" style={{ marginRight: 6 }} />Уебсайт</label><InputText value={profile.website} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} /></div>
                                        <div className="field full"><label><Icon name="comment" style={{ marginRight: 6 }} />За мен</label><InputTextarea value={profile.description} onChange={e => setProfile(p => ({ ...p, description: e.target.value }))} rows={4} autoResize /></div>
                                        <div className="field"><label><Icon name="globe" style={{ marginRight: 6 }} />Езици</label><MultiSelect value={profile.languages} options={langs} onChange={e => setProfile(p => ({ ...p, languages: e.value }))} display="chip" placeholder="Езици" /></div>
                                        <div className="field"><label><Icon name="map-marker" style={{ marginRight: 6 }} />Квартали/зони</label><Chips value={profile.serviceAreas} onChange={e => setProfile(p => ({ ...p, serviceAreas: e.value || [] }))} /></div>
                                    </div>
                                    <Divider />
                                    <div className="actions"><Button icon={<Icon name="save" />} label="Запази" onClick={saveProfile} /></div>
                                </TabPanel>

                                <TabPanel header={<span><Icon name="building" style={{ marginRight: 8 }} />Моите обяви</span>}>
                                    <div className="table-wrap">
                                        <DataTable value={listings} paginator rows={5} responsiveLayout="scroll" emptyMessage="Няма обяви">
                                            <Column header="Снимка" body={(row: ListingRow) => <img alt="" className="list-img" src={row.image} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />} style={{ width: 90 }} />
                                            <Column field="id" header="#" sortable style={{ width: 120 }} />
                                            <Column field="title" header="Заглавие" sortable />
                                            <Column header="Цена" body={(row: ListingRow) => fmt.format(row.price)} sortable />
                                            <Column field="district" header="Квартал" sortable />
                                            <Column field="status" header="Статус" body={(r: ListingRow) => <Tag value={r.status} severity={r.status === 'Публикувана' ? 'success' : r.status === 'Чернова' ? 'info' : 'warning'} rounded />} sortable />
                                            <Column field="views" header="Преглеждания" sortable />
                                            <Column field="created" header="Създадена" body={(r: ListingRow) => fmtDate(r.created)} sortable />
                                            <Column header="Действия" body={(row: ListingRow) => (
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <Button icon={<Icon name="eye" />} text rounded onClick={() => toast.current?.show({ severity: 'info', summary: row.id })} />
                                                    <Button icon={<Icon name="pencil" />} text rounded onClick={() => toast.current?.show({ severity: 'info', summary: 'Редакция ' + row.id })} />
                                                    <Button icon={<Icon name="eye-slash" />} text rounded onClick={() => deleteListing(row)} />
                                                </div>
                                            )} />
                                        </DataTable>
                                    </div>
                                </TabPanel>

                                <TabPanel header={<span><Icon name="bookmark" style={{ marginRight: 8 }} />Запазени имоти</span>}>
                                    <div className="table-wrap">
                                        <DataTable value={saved} responsiveLayout="scroll" emptyMessage="Нямате запазени имоти">
                                            <Column header="Снимка" body={(row: ListingRow) => <img alt="" className="list-img" src={row.image} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />} style={{ width: 90 }} />
                                            <Column field="title" header="Имот" />
                                            <Column header="Цена" body={(row: ListingRow) => fmt.format(row.price)} />
                                            <Column field="district" header="Квартал" />
                                            <Column header="Действия" body={(row: ListingRow) => <Button icon={<Icon name="times" />} text rounded onClick={() => setSaved(prev => prev.filter(x => x.id !== row.id))} />} />
                                        </DataTable>
                                    </div>
                                </TabPanel>

                                <TabPanel header={<span><Icon name="bell" style={{ marginRight: 8 }} />Известия</span>}>
                                    <div className="row">
                                        <div className="field"><label><Icon name="comments" style={{ marginRight: 6 }} />Нови съобщения</label><InputSwitch checked={notif.newMessages} onChange={e => setNotif(n => ({ ...n, newMessages: e.value }))} /></div>
                                        <div className="field"><label><Icon name="arrow-down" style={{ marginRight: 6 }} />Понижение на цена по мои обяви</label><InputSwitch checked={notif.priceDrops} onChange={e => setNotif(n => ({ ...n, priceDrops: e.value }))} /></div>
                                        <div className="field"><label><Icon name="send" style={{ marginRight: 6 }} />Бюлетин</label><InputSwitch checked={notif.newsletter} onChange={e => setNotif(n => ({ ...n, newsletter: e.value }))} /></div>
                                    </div>
                                    <Divider />
                                    <div className="actions"><Button icon={<Icon name="save" />} label="Запази" onClick={saveNotif} /></div>
                                </TabPanel>

                                <TabPanel header={<span><Icon name="star" style={{ marginRight: 8 }} />Ревюта</span>}>
                                    <div className="table-wrap">
                                        <DataTable value={reviews} responsiveLayout="scroll" emptyMessage="Все още няма ревюта">
                                            <Column field="user" header="Потребител" body={(r: ReviewRow) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="user" />{r.user}</span>} />
                                            <Column header="Оценка" body={(r: ReviewRow) => <Rating value={r.rating} cancel={false} readOnly />} />
                                            <Column field="text" header="Отзив" />
                                            <Column field="date" header="Дата" body={(r: ReviewRow) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="calendar" />{r.date}</span>} />
                                        </DataTable>
                                    </div>
                                </TabPanel>

                                <TabPanel header={<span><Icon name="file" style={{ marginRight: 8 }} />Документи</span>}>
                                    <div className="field"><label><Icon name="folder-open" style={{ marginRight: 6 }} />Документи за верификация (лиценз, фирмени)</label>
                                        <FileUpload mode="advanced" name="docs" customUpload uploadHandler={uploadDocs} multiple accept="image/*,application/pdf" auto chooseLabel="Добави" uploadLabel="Качи" cancelLabel="Отказ" />
                                    </div>
                                    <div className="docs-grid">
                                        {docs.map((src, i) => (
                                            <div key={i} className="card" style={{ padding: 8, display: 'grid', placeItems: 'center' }}>
                                                <img src={src} alt="doc" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 8 }} />
                                            </div>
                                        ))}
                                        {docs.length === 0 && (
                                            <div className="sub" style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Icon name="info" /> Няма качени документи
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>

                                <TabPanel header={<span><Icon name="shield" style={{ marginRight: 8 }} />Сигурност</span>}>
                                    <div className="row">
                                        <div className="field"><label><Icon name="lock" style={{ marginRight: 6 }} />Текуща парола</label><InputText type="password" /></div>
                                        <div className="field"><label><Icon name="key" style={{ marginRight: 6 }} />Нова парола</label><InputText type="password" /></div>
                                        <div className="field"><label><Icon name="key" style={{ marginRight: 6 }} />Повтори парола</label><InputText type="password" /></div>
                                    </div>
                                    <Divider />
                                    <div className="actions"><Button icon={<Icon name="key" />} label="Промени парола" /></div>
                                </TabPanel>
                            </TabView>
                        </Card>
                    </section>
                </section>

                <footer style={{ margin: '28px 0 36px' }} className="sub">© 2025 Acme Estates — профил</footer>
            </main>
        </div>
    );
}
