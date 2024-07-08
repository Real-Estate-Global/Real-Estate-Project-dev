import { Link } from 'react-router-dom'
import AuthContext from '../../contexts/authContext'
import { useContext } from 'react'

export default function Header() {
    const {
        isAuthenticated,
    } = useContext(AuthContext)

    return (
        <>
            <header>
                <nav className="navigation">
                    <Link className="home-link nav-link" to='/'>Начало</Link>
                    {isAuthenticated && (
                        <div id="user-navigation">
                            <Link className='my-offers nav-link' to='/myoffers'>Моите обяви</Link>
                            {/* email === "admin@abv.bg" && (
                               <Link className='all-offers nav-link' to='/alloffers'>Всички обяви</Link> 
                            ) */}
                            <Link className='my-profile nav-link' to='/myprofile'>Моят профил</Link>
                            {/* <Link className="add-offer-link nav-link" to='/add-offer'>Добави обява</Link> */}
                            <Link className="logout nav-link" to='/logout'>Изход</Link>
                        </div>
                    )}
                    
                    {/* <Link to='/about'>About</Link> */}
                    {!isAuthenticated && (
                        <div id="guest-navigation">
                            <Link className="login-link nav-link" to='/login'>Вход</Link>
                            <Link className="signup-link nav-link" to='/signup'>Регистрация</Link>
                            <Link className="add-offer-link nav-link" to='/add-offer'>Добави обява</Link>
                        </div>
                    )}
                    {/* <Link className="login-link nav-link" to='/login'>Вход</Link>
                    <Link className="signup-link nav-link" to='/signup'>Регистрация</Link>
                    <Link className="add-offer-link nav-link" to='/add-offer'>Добави обява</Link> */}
                </nav>
            </header>
        </>
    )
}