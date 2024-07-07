import { useContext, useState } from "react"
import useForm from "../../hooks/useForm"
import Button from "react-bootstrap/esm/Button"
import Card from "react-bootstrap/Card"
import styles from './SignUp.module.css'
import { Link } from "react-router-dom"
import { signup } from "../../services/authService.js";
import LoaderContext from "../../contexts/loaderContext.js";
import AuthContext from "../../contexts/authContext.js"

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

const RegisterFormKeys = {
    Name: 'name',
    Email: 'email',
    PhoneNumber: 'phoneNumber',
    ProfileType: 'profileType',
    Password: 'password',
    ConfirmedPassword: 'confirmedPassword',
}
export default function SignUp() {
    const { setLoading } = useContext(LoaderContext)
    // TODO: add local form error
    const [hasError, setError] = useState({ hasError: false, message: '' })
    const {loginSubmitHandler} = useContext(AuthContext)
    const registerSubmitHandler = async (values) => {
        if (values[RegisterFormKeys.ConfirmedPassword] === values[RegisterFormKeys.Password]) {
            try {
                setLoading({ isLoading: true })
                await signup({
                    fullName: values[RegisterFormKeys.Name],
                    email: values[RegisterFormKeys.Email],
                    password: values[RegisterFormKeys.Password],
                    profileType: values[RegisterFormKeys.ProfileType],
                    phoneNumber: values[RegisterFormKeys.PhoneNumber],
                })
                await loginSubmitHandler(values)
            } catch (e) {
                setError({ hasError: true, message: e.message })
            } finally {
                setLoading({ isLoading: false })

            }
        } else {
            setError({ hasError: true, message: "Паролите не съвпадат, моля опитайте отново." })
        }

    }

    const { values, onChange, onSubmit } = useForm(registerSubmitHandler, {
        [RegisterFormKeys.Name]: '',
        [RegisterFormKeys.Email]: '',
        [RegisterFormKeys.Password]: '',
        [RegisterFormKeys.ConfirmedPassword]: '',
        [RegisterFormKeys.ProfileType]: ''
    })

    return (
        <>
            <div className={styles["signup-form-wrapper"]}>
                <Card className={styles["signup-form-card"]}>
                    <h1 className={styles["signup-title"]}>Регистрация</h1>
                    <form className={styles["signup-form"]} action="url" onSubmit={onSubmit}>
                        <label htmlFor="name"></label>
                        <input
                            required
                            type="text"
                            id="name"
                            name="name"
                            onChange={onChange}
                            value={values[RegisterFormKeys.Name]}
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
                            value={values[RegisterFormKeys.Email]}
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
                            value={values[RegisterFormKeys.PhoneNumber]}
                            className={styles["registration-input"]}
                        />
                        <label htmlFor="profileType"></label>
                        <select
                            required
                            id="profileTypr"
                            name="profileType"
                            onChange={onChange}
                            className={styles["registration-input"]}

                        >
                            <option value="" disabled selected hidden>Тип профил</option>
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
                            value={values[RegisterFormKeys.Password]}
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
                            value={values[RegisterFormKeys.ConfirmedPassword]}
                            className={styles["registration-input"]}
                        />

                        <Button className={styles["signup-button"]} variant="primary" type="submit"
                            value="Регистрирай">Регистрирай</Button>

                        <div>
                            <p>Вече имате профил? <Link to='/login'>Влезте в профила си</Link></p>
                        </div>
                    </form>
                </Card>
            </div>
        </>

    )
}
