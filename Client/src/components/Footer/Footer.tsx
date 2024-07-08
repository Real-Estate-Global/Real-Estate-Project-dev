import styles from './Footer.module.css'

export default function Footer() {
    return(
        <footer>
            <h1 className={styles["footer-text"]}>Този проект е изготвен с образователни цели и съответно всяко съдържание в него е изцяло и единствено използвано за същите.</h1>
        </footer>
    )
}