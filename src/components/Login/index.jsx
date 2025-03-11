import { useState } from "react";
import axios from 'axios';
import styles from "../../styles/Auth.module.scss";
import { encodeString } from "@/utils/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function LoginComponent() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState(false);

    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const encodedPassword = encodeString(formData.password);
            const payload = {
                username: formData.username,
                password: encodedPassword
            };

            try {
                const response = await axios.post(`${process.env.BASE_URL}/api/auth/login`, payload, {
                    withCredentials: true,
                });

                if (response?.data?.data == "Login successful") {
                    router.push({
                        pathname: '/',
                        query: router?.query || {}
                    })
                    return;
                } else {
                    setLoginError(true);
                }
            } catch (error) {
                console.error("handleSubmit", error);
                setLoginError(true);
            }
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.heading}>Login</h1>
                <div className={styles.field}>
                    <label>Username *</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    {errors.username && <span className={styles.error}>{errors.username}</span>}
                </div>
                <div className={styles.field}>
                    <label>Password *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <span className={styles.error}>{errors.password}</span>}
                </div>
                <button type="submit" className={styles.button}>Login</button>
                {loginError && <div className={styles.field}><span className={styles.error}>Invalid username or password</span></div>}
                <Link className={styles.link_tag} href={{ pathname: "/signup", query: router?.query ?? {} }}>SignUp</Link>
            </form>
        </div>
    );
}