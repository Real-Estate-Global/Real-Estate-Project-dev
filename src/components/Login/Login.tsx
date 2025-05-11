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
      <div className={styles["login-div"]}>
        <Card className={styles["login-form-card"]}>
          <h1 className={styles["login-title"]}>Вход</h1>
          <form className={styles["login-form"]} onSubmit={onSubmit}>
            <div className="login-input-wrapper">
              <FloatLabel>
                <InputText className="login-input" id="username" value={values[LoginFormKeys.Email]} onChange={onChange} name={LoginFormKeys.Email} />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>
            {/* <label htmlFor="email">Имейл или потребителско име: </label>
            <input
              required
              type="text"
              id="email"
              name={LoginFormKeys.Email}
              onChange={onChange}
              value={values[LoginFormKeys.Email]}
            /> */}
            <div className="login-input-wrapper">
              <FloatLabel>
                <Password className="login-input" value={values[LoginFormKeys.Password]} onChange={onChange} feedback={false} tabIndex={1} toggleMask name={LoginFormKeys.Password} />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </div>
            {/* <label htmlFor="password">Парола: </label>
            <input
              className={styles["password-input"]}
              required
              type="password"
              id="password"
              name={LoginFormKeys.Password}
              value={values[LoginFormKeys.Password]}
              onChange={onChange}
            /> */}
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
      </div>
    </>
  );
};
