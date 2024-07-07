import Alert from 'react-bootstrap/Alert'
import { useContext } from 'react'
import ErrorContext from '../../contexts/errorContext'
import styles from './ErrorPopup.module.css'

export default function ErrorPopup() {
    const { error, setError } = useContext(ErrorContext)

    if (!error?.hasError) {
        return null
    }

    return (
        <div className={styles["alert-wrapper"]}>
            <Alert 
            
                style={{zIndex: "6"}}
                className={styles[` alert ${error?.hasError ? 'show-alert' : ''}`]} 
                variant={'danger'} 
                onClose={() => {
                  setError({ hasError: false })
              }} 
              dismissible
            >
                {error?.message}
            </Alert>
        </div>
    )
}