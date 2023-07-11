import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/** Login form.
 *
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to / route
 *
 * MyRoutes -> LoginForm 
 * Routed as /login
 */


const LoginForm = ({ login }) => {
    const INITIAL_STATE = { username: "", password: "" };
    const [formData, setFormData] = useState(INITIAL_STATE);

    const navigate = useNavigate();

    /** Handle form submit:
     *
     * Calls login func prop and, if successful, redirect to /.
     */
    const handleSubmit = evt => {
        evt.preventDefault();
        login(formData)
        setFormData(INITIAL_STATE);
        navigate(`/`);
    };

    /** Update form data field */
    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    /** render form */

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <br />
            <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
            />
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <br />


            <button>Submit</button>
        </form>
    );
};
export default LoginForm;