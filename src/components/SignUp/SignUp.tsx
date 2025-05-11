import { useCallback, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
// import styles from "./SignUp.module.css";
import { Link } from "react-router-dom";
import { LoginDataType } from "../../types/LoginDataType";
import { useAppDispatch } from "../../store/hooks";
import { loadingSliceActions } from "../../store/slices/loading";
import { errorSliceActions } from "../../store/slices/error";
import { ErrorType } from "../../types/ErrorType";
import { ProfileDataType, SignupFormDataEnum } from "../../types/ProfileDataType";
import { useSignupMutation } from "../../store/api/user";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownProps } from 'primereact/dropdown'

// TODO:
// User:::
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
            agencyName: values.agencyName,
            // agencyName: values.agencyName, // само ако е избрана агенция
            // agencyEik: values.agencyEik, // само ако е избрана агенция
            // role: values.role, // само ако е брокер
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
    [SignupFormDataEnum.PhoneNumber]: "",
    [SignupFormDataEnum.AgencyName]: "",
    [SignupFormDataEnum.AgencyEik]: "",
    [SignupFormDataEnum.Role]: "",
  });

  // Състояние за управление на показваните полета в зависимост от типа потребител
  const [profileType, setProfileType] = useState("");

  const handleProfileTypeChange = (e: DropdownProps) => {
    setProfileType(e.value);
  };

  const profileTypes = [
    { name: "Частно лице", value: "individual" },
    { name: "Агенция", value: "agency" },
    { name: "Брокер", value: "broker" },
  ];

  const profileTypeToName = {
    individual: "Частно лице",
    agency: "Агенция",
    broker: "Брокер",
  };
  const profileTypesOptions = Object.entries(profileTypeToName).map(([key, value]) => ({
    name: value,
    value: key,
  }));
console.log(profileTypesOptions);

  return (
    <div className={"signup-form-wrapper"}>
      <Card className={"signup-form-card"}>
        <h1 className={"signup-title"}>Регистрация</h1>
        <form className={"signup-form"} onSubmit={onSubmit}>
          {/* Име на потребителя */}
          <div className="signup-input-wrapper">
            <FloatLabel>
              <InputText
                className="login-input"
                id="username"
                value={values[SignupFormDataEnum.Name]}
                onChange={onChange}
                name={SignupFormDataEnum.Name}
              />
              <label htmlFor="username">Username</label>
            </FloatLabel>
          </div>

          {/* Имейл */}
          <div className="signup-input-wrapper">
            <FloatLabel>
              <InputText
                type="email"
                className="login-input"
                id="email"
                value={values[SignupFormDataEnum.Email]}
                onChange={onChange}
                name={SignupFormDataEnum.Email}
              />
              <label htmlFor="username">Email</label>
            </FloatLabel>
          </div>

          {/* Телефонен номер */}
          <div className="signup-input-wrapper">
            <FloatLabel>
              <InputText
                type="tel"
                className="login-input"
                id="phoneNumber"
                value={values[SignupFormDataEnum.PhoneNumber]}
                onChange={onChange}
                name={SignupFormDataEnum.PhoneNumber}
              />
              <label htmlFor="phoneNumber">Телефонен номер</label>
            </FloatLabel>
          </div>

          {/* Избор на тип потребител */}
          {/* <label htmlFor="profileType"></label>
          <select
            required
            id="profileType"
            name="profileType"
            onChange={handleProfileTypeChange}
            className={"registration-input"}
          >
            <option value="" disabled selected hidden>
              Тип профил
            </option>
            <option value="individual">Частно лице</option>
            <option value="agency">Агенция</option>
            <option value="broker">Брокер</option>
          </select> */}

          <div className="signup-input-wrapper dropdown-wrapper">
            <FloatLabel>
              <Dropdown
                className="login-input w-full dropdown-type-selection"
                inputId="profileType"
                value={profileType}
                onChange={handleProfileTypeChange}
                options={profileTypesOptions}
                optionLabel="name"
              />
              <label htmlFor="profileType">Изберете тип профил</label>
            </FloatLabel>
          </div>
          {/* Полета за агенция */}
          {profileType === "agency" && (
            <>
              <div className="signup-input-wrapper">
                <FloatLabel>
                  <InputText
                    className="login-input"
                    id="agencyName"
                    value={values[SignupFormDataEnum.AgencyName]}
                    onChange={onChange}
                    name={SignupFormDataEnum.AgencyName}
                  />
                  <label htmlFor="agencyName">Име на агенцията</label>
                </FloatLabel>
              </div>
              <div className="signup-input-wrapper">
                <FloatLabel>
                  <InputText
                    className="login-input"
                    id="agencyEik"
                    value={values[SignupFormDataEnum.AgencyEik]}
                    onChange={onChange}
                    name={SignupFormDataEnum.AgencyEik}
                  />
                  <label htmlFor="agencyEik">ЕИК на агенцията</label>
                </FloatLabel>
              </div>
            </>
          )}

          {/* Полета за брокер */}
          {profileType === "broker" && (
            <div className="signup-input-wrapper">
              <FloatLabel>
                <InputText
                  className="login-input"
                  id="role"
                  value={values[SignupFormDataEnum.Role]}
                  onChange={onChange}
                  name={SignupFormDataEnum.Role}
                />
                <label htmlFor="role">Роля в агенцията</label>
              </FloatLabel>
            </div>
          )}

          {/* Парола */}
          <div className="signup-input-wrapper">
            <FloatLabel>
              <InputText
                type="password"
                className="login-input"
                id="password"
                value={values[SignupFormDataEnum.Password]}
                onChange={onChange}
                name={SignupFormDataEnum.Password}
              />
              <label htmlFor="password">Парола</label>
            </FloatLabel>
          </div>

          {/* Потвърдете паролата */}
          <div className="signup-input-wrapper">
            <FloatLabel>
              <InputText
                type="password"
                className="login-input"
                id="confirmedPassword"
                value={values[SignupFormDataEnum.ConfirmedPassword]}
                onChange={onChange}
                name={SignupFormDataEnum.ConfirmedPassword}
              />
              <label htmlFor="confirmedPassword">Повторете паролата</label>
            </FloatLabel>
          </div>

          <Button
            className={"signup-button"}
            type="submit"
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
  );
};
