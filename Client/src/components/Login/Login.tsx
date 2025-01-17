import { useForm } from "../../hooks/useForm";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { LoginDataType } from "../../types/LoginDataType";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

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
            <label htmlFor="email">Имейл или потребителско име: </label>
            <input
              required
              type="text"
              id="email"
              name={LoginFormKeys.Email}
              onChange={onChange}
              value={values[LoginFormKeys.Email]}
            />
            <label htmlFor="password">Парола: </label>
            <input
              className={styles["password-input"]}
              required
              type="password"
              id="password"
              name={LoginFormKeys.Password}
              value={values[LoginFormKeys.Password]}
              onChange={onChange}
            />
            <Button
              className={styles["login-button"]}
              type="submit"
              value="Вход"
            >
              Вход
            </Button>
            <div>
              <p>
                Нямате профил? <Link to="/signup">Регистрирайте се</Link>{" "}
              </p>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};
