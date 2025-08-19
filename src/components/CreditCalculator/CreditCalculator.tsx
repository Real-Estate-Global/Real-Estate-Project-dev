import { Divider } from "primereact/divider";
import { InputNumber } from "primereact/inputnumber";
import { useMemo, useState } from "react";

function useCurrency() {
    return useMemo(() => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR" }), []);
}

export const CreditCalculator = ({ price }: { price: number }) => {
    const fmt = useCurrency();
    const [amount, setAmount] = useState<number>(price);
    const [downPct, setDownPct] = useState<number>(20);
    const [ratePct, setRatePct] = useState<number>(2.8);
    const [years, setYears] = useState<number>(30);
    const monthly = useMemo(() => {
        const P = amount * (1 - downPct / 100);
        const r = (ratePct / 100) / 12;
        const n = years * 12;
        const m = r === 0 ? (P / n) : (P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
        return isFinite(m) ? m : 0;
    }, [amount, downPct, ratePct, years]);
    return (
        <div className="calc">
            <div className="form-row">
                <div className="field">
                    <label htmlFor="mc-price">Цена (€)</label>
                    <InputNumber inputId="mc-price" value={amount} onValueChange={(e) => setAmount(e.value || 0)} mode="currency" currency="EUR" locale="bg-BG" />
                </div>
                <div className="field">
                    <label htmlFor="mc-down">Първоначална вноска (%)</label>
                    <InputNumber inputId="mc-down" value={downPct} onValueChange={(e) => setDownPct(e.value || 0)} suffix="%" min={0} max={100} />
                </div>
                <div className="field">
                    <label htmlFor="mc-rate">Лихва (% год.)</label>
                    <InputNumber inputId="mc-rate" value={ratePct} onValueChange={(e) => setRatePct(e.value || 0)} suffix="%" min={0} step={0.1} />
                </div>
                <div className="field">
                    <label htmlFor="mc-years">Срок (години)</label>
                    <InputNumber inputId="mc-years" value={years} onValueChange={(e) => setYears(e.value || 0)} min={1} max={40} />
                </div>
            </div>
            <Divider />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 900, fontSize: 22 }}>Месечна вноска: {fmt.format(monthly)}</div>
                <div className="sub">Ориентировъчно изчисление. За точна оферта се свържете с кредитен консултант.</div>
            </div>
        </div>
    );
}