import { Link } from "react-router-dom";
import { authSliceSelectors } from "../../store/slices/auth";
import { useAppSelector } from "../../store/hooks";

export const Header = () => {
  const isAuthenticated = useAppSelector(authSliceSelectors.accessToken);

  return (
    <>
      <header style={{fontFamily: "Comfortaa"}}>
        <nav className="navigation">
          <Link className="home-link nav-link" to="/" style={{fontFamily: "Comfortaa"}}>
            {/* Начало */}
            <img style={{width: "140px"}} src="./tursiimoti-header-example.png"/>
          </Link>
          {isAuthenticated && (
            <div id="user-navigation">
              <Link className="my-offers nav-link" to="/myoffers">
                Моите обяви
              </Link>
              {/* email === "admin@abv.bg" && (
                               <Link className='all-offers nav-link' to='/alloffers'>Всички обяви</Link> 
                            ) */}
              <Link className="my-profile nav-link" to="/myprofile">
                Моят профил
              </Link>
              {/* <Link className="add-offer-link nav-link" to='/add-offer'>Добави обява</Link> */}
              <Link className="logout nav-link" to="/logout">
                Изход
              </Link>
            </div>
          )}

          {/* <Link to='/about'>About</Link> */}
          {!isAuthenticated && (
            <div id="guest-navigation">
              <Link className="login-link nav-link" to="/login">
                Вход
              </Link>
              <Link className="signup-link nav-link" to="/signup">
                Регистрация
              </Link>
              <Link className="add-offer-link nav-link" to="/add-offer">
                Добави обява
              </Link>
            </div>
          )}
          {/* <Link className="login-link nav-link" to='/login'>Вход</Link>
                    <Link className="signup-link nav-link" to='/signup'>Регистрация</Link>
                    <Link className="add-offer-link nav-link" to='/add-offer'>Добави обява</Link> */}
        </nav>
      </header>
    </>
  );
};
