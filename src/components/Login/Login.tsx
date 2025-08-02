import { useForm } from "../../hooks/useForm";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { LoginDataType } from "../../types/LoginDataType";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";

export enum LoginFormKeys {
  Email = "email",
  Password = "password",
}

type Props = {
  loginSubmitHandler: (values: LoginDataType) => void;
};
export const Login: React.FC<Props> = ({ loginSubmitHandler }) => {
  const { values, onChange, onSubmit } = useForm(loginSubmitHandler, {
    [LoginFormKeys.Email]: "",
    [LoginFormKeys.Password]: "",
  });

  return (
    <>
      {/* <div className={styles["login-div"]}>
        <Card className="login-form-card">

          <form className={styles["login-form"]} onSubmit={onSubmit}>
            <h1 className={styles["login-title"]} style={{fontFamily: "Comfortaa"}}>Вход</h1>
            <div className="login-input-wrapper">
              <FloatLabel>
                <InputText
                  className="login-input"
                  id="username"
                  value={values[LoginFormKeys.Email]}
                  onChange={onChange}
                  name={LoginFormKeys.Email}
                />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>
            <div className="login-input-wrapper">
              <FloatLabel>
                <Password
                  className="login-input"
                  value={values[LoginFormKeys.Password]}
                  onChange={onChange}
                  feedback={false}
                  tabIndex={1}
                  toggleMask name={LoginFormKeys.Password}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </div>
            <Button
              className="login-button"
              type="submit"
              value="Вход"
            >
              Вход
            </Button>
            <div>
              <p>
                Нямате профил? <Link className="register-link-login-form" to="/signup">Регистрирайте се</Link>{" "}
              </p>
            </div>
          </form>
        </Card>
      </div> */}



      {/* THE FOLLOWING LINES ARE COMMENTED OUT FOR TESTING PURPOSES!!!! */}

      <div className="login-div-wrapper-new">
        <div className="login-div">
          <Card className="" style={{ width: "90%", margin: "auto", backgroundColor: "white", display: "flex", flexDirection: "row", justifyContent: "space-between", position: "relative" }}>

            <div style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center", }}>
              <form className={styles["login-form"]} onSubmit={onSubmit}>
                <h1 className={styles["login-title"]}>Добре дошли!</h1>
                <div className="login-input-wrapper">
                  <FloatLabel>
                    <InputText
                      className="login-input"
                      id="email"
                      value={values[LoginFormKeys.Email]}
                      onChange={onChange}
                      name={LoginFormKeys.Email}
                    />
                    <label htmlFor="email">Имейл</label>
                  </FloatLabel>
                </div>
                <div className="login-input-wrapper">
                  <FloatLabel>
                    <Password
                      className="login-input"
                      value={values[LoginFormKeys.Password]}
                      onChange={onChange}
                      feedback={false}
                      tabIndex={1}
                      toggleMask name={LoginFormKeys.Password}
                    />
                    <label htmlFor="password">Парола</label>
                  </FloatLabel>
                </div>
                <Button
                  className="login-button"
                  type="submit"
                // label="Вход"
                >
                  Вход
                </Button>
                <div>
                  <p>
                    Нямате профил?{" "}
                    <Link className="register-link-login-form" to="/signup">
                      Регистрирайте се
                    </Link>{" "}
                  </p>
                </div>
                <div className="social-login">
                  <div className="divider">
                    <span>or</span>
                  </div>
                  <div className="social-buttons">
                    <button className="social-btn google">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                      Влез с Google
                    </button>
                    <button className="social-btn apple">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" />
                      Влез с Apple
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="login-image-wrapper" style={{ width: "50%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "pink", borderRadius: "6px" }}>
              <img
                className="login-image"
                src="https://tursi-imoti-public.s3.eu-central-1.amazonaws.com/login-side-photo.png"
                style={{ objectFit: "cover", borderRadius: "6px" }}
                alt="Login"
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
