import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "../auth/authForm.css"


/** Homepage of site.
 *
 * Shows welcome message or login/register buttons.
 *
 * Routed at /
 *
 * MyRoutes -> Homepage
 */

const UpdateUserForm = ({ updateUser }) => {



    const navigate = useNavigate();
    const { currentUser, token } = useContext(UserContext);
    let INITIAL_STATE = { password: "", firstName: currentUser.firstName, lastName: currentUser.lastName }
    const [formData, setFormData] = useState(INITIAL_STATE);


    useEffect(() => {
        if (token && currentUser) {
            INITIAL_STATE = { password: "", firstName: currentUser.firstName, lastName: currentUser.lastName };
            setFormData(INITIAL_STATE)
        }
    }, [currentUser])





    /** on form submit:
     *   - clear password
     *   - Tell the parent to update user
     */

    const handleSubmit = evt => {
        evt.preventDefault();

        let profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
        };

        updateUser(profileData)
        setFormData(INITIAL_STATE);
        navigate(`/`);
    };

    /** Update form fields */

    const handleChange = evt => {
        const { name, value } = evt.target;
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    };

    /** render form */

    return (
        <form className="form_main" onSubmit={handleSubmit}>
            <p className="heading-profile-edit">Edit {currentUser.firstName || currentUser.username}'s Profile</p>

            <div className="inputContainer">

                <input className="inputField" type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>

            <div className="inputContainer">

                <input className="inputField" type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>



            <div className="inputContainer">
                <svg viewBox="0 0 16 16" fill="#2e2e2e" height="16" width="16" xmlns="http://www.w3.org/2000/svg" className="inputIcon">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
                </svg>
                <input placeholder="Password" className="inputField" type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
            </div>


            <button id="button">Submit Changes</button>
        </form>
    )

};
export default UpdateUserForm;