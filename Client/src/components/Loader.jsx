import Spinner from 'react-bootstrap/Spinner';
import LoaderContext from '../contexts/loaderContext';
import { useContext } from 'react';

export default function Loader() {
    const { loading } = useContext(LoaderContext)

    if (!loading.isLoading) {
        return null
    }
    return (
        <div className={`loader-wrapper ${loading.isLoading ? 'show-loader' : ''}`}>
            <Spinner animation="border" role="status">
                {/* <span className="visually-hidden">Loading...</span> */}
            </Spinner>
        </div>
    )
}
