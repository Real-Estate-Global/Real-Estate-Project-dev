import { useCallback } from "react";
import { useForm } from "../../hooks/useForm";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import styles from "./SignUp.module.css";
import { Link } from "react-router-dom";
import { LoginDataType } from "../../types/LoginDataType";
import { useAppDispatch } from "../../store/hooks";
import { loadingSliceActions } from "../../store/slices/loading";
import { errorSliceActions } from "../../store/slices/error";
import { ErrorType } from "../../types/ErrorType";
import { ProfileDataType, SignupFormDataEnum } from "../../types/ProfileDataType";
import { useSignupMutation } from "../../store/api/user";

// TODO:
// User::
// :userId*
// :email*
// :fullName*
// :phoneNumber*
// :type - individual, agency, (admin)*
// :+photo+(optional)
// :description(optional)
// :address(optional)
// :instagram/facebook(optional)

type Props = {
  loginSubmitHandler: (values: LoginDataType) => Promise<void>;
};

export const SignUp: React.FC<Props> = ({ loginSubmitHandler }) => {
  // TODO: add local form error
  const dispatch = useAppDispatch();
  const [signup] = useSignupMutation();
  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch(loadingSliceActions.setLoading(isLoading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: ErrorType) => {
      dispatch(errorSliceActions.setError(error));
    },
    [dispatch]
  );

  const registerSubmitHandler = useCallback(
    async (values: ProfileDataType & { confirmedPassword: string }) => {
      if (values.confirmedPassword === values.password) {
        try {
          setLoading(true);
          await signup({
            name: values.name,
            email: values.email,
            password: values.password,
            profileType: values.profileType,
            phoneNumber: values.phoneNumber,
          });
          await loginSubmitHandler({
            password: values.password,
            email: values.email,
          });
        } catch (e: any) {
          setError({ hasError: true, message: e.message });
        } finally {
          setLoading(false);
        }
      } else {
        setError({
          hasError: true,
          message: "Паролите не съвпадат, моля опитайте отново.",
        });
      }
    },
    []
  );

  const { values, onChange, onSubmit } = useForm(registerSubmitHandler, {
    [SignupFormDataEnum.Name]: "",
    [SignupFormDataEnum.Email]: "",
    [SignupFormDataEnum.Password]: "",
    [SignupFormDataEnum.ConfirmedPassword]: "",
    [SignupFormDataEnum.ProfileType]: "",
  });

  return (
    <>
      <div className={styles["signup-form-wrapper"]}>
        <Card className={styles["signup-form-card"]}>
          <h1 className={styles["signup-title"]}>Регистрация</h1>
          <form
            className={styles["signup-form"]}
            action="url"
            onSubmit={onSubmit}
          >
            <label htmlFor="name"></label>
            <input
              required
              type="text"
              id="name"
              name="name"
              onChange={onChange}
              value={values[SignupFormDataEnum.Name]}
              placeholder="Име"
              className={styles["registration-input"]}
            />
            <label htmlFor="email"></label>
            <input
              placeholder="E-mail"
              required
              type="email"
              id="email"
              name="email"
              onChange={onChange}
              value={values[SignupFormDataEnum.Email]}
              className={styles["registration-input"]}
            />
            <label htmlFor="phoneNumber"></label>
            <input
              placeholder="Телефонен номер"
              required
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              onChange={onChange}
              value={values[SignupFormDataEnum.PhoneNumber]}
              className={styles["registration-input"]}
            />
            <label htmlFor="profileType"></label>
            <select
              required
              id="profileTypr"
              name="profileType"
              onChange={onChange as any}
              className={styles["registration-input"]}
            >
              <option value="" disabled selected hidden>
                Тип профил
              </option>
              <option value="individual">Частно лице</option>
              <option value="agency">Агенция</option>
            </select>
            <label htmlFor="password"></label>
            <input
              placeholder="Парола"
              required
              type="password"
              id="password"
              name="password"
              onChange={onChange}
              value={values[SignupFormDataEnum.Password]}
              className={styles["registration-input"]}
            />
            <label htmlFor="confirmedPassword"></label>
            <input
              placeholder="Повторете паролата"
              required
              type="password"
              id="confirmedPassword"
              name="confirmedPassword"
              onChange={onChange}
              value={values[SignupFormDataEnum.ConfirmedPassword]}
              className={styles["registration-input"]}
            />

            <Button
              className={styles["signup-button"]}
              type="submit"
              value="Регистрирай"
            >
              Регистрирай
            </Button>

            <div>
              <p>
                Вече имате профил? <Link to="/login">Влезте в профила си</Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};
