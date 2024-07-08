import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/esm/Button";
import styles from './ConfirmPopup.module.css';

export default function ConfirmPopup({ show, text, onConfirm, onCancel }) {
    if (!show) {
        return null
    }

    return (
        <div className={styles["visible-popup"]}>
            <Card className={styles["delete-popup"]}>
                <p>{text}</p>
                <div className={styles["button-container"]}>
                <Button onClick={onCancel} className={styles["no-button"]}>Не</Button>
                <Button onClick={onConfirm} className={styles["yes-button"]}>Да</Button>
                </div>
            </Card>
        </div>
    )
}