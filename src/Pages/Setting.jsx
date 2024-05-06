import { useState } from "react";
import avater from "../images/avater.png";
import "../styles/setting.css";
import EditIcon from "../Icons/EditIcon";
import AlertModel from "../components/AlertModel";
import { UseGlobalUser } from "../auth/AuthUser";
import { deleteUser, editUser, editUserImage } from "../APIS";
import ErrorAlert from "../components/ErrorAlert";

export default function Setting() {
  const { user, logout, setUser } = UseGlobalUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [noDrop, setNoDrop] = useState(true);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [formData, setFormData] = useState({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image_path,
  });

  const vaildation = () => {
    const { name, email } = formData;
    const vaildEmail = /^[a-zA-Z][a-zA-Z0-9]*@gmail.com$/;
    const validName =
      /^([a-zA-Z][a-zA-Z0-9]*)(?!.*[-$#!@%^&*{}[()\]></?"_+=.~-])/;
    let isValid = true;
    if (name.trim().length <= 1 || email.trim().length <= 1) {
      return (isValid = false);
    }
    if (
      email.split("@")[0].length < 4 || // The number of letters in the name must be at least 5
      [...new Set(email.split("@")[0])].length <= 1 || //Test whether this name is a duplicate or a real name
      !vaildEmail.test(email) // I test whether the entire email contains the correct general form or not
    ) {
      setEmailError(true);
      isValid = false;
    }
    if (!validName.test(name)) {
      setNameError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vaildation() || noDrop) return;
    setLoading(true);
    try {
      const response = await editUser(formData);
      const { user } = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      ErrorAlert("This information cannot be updated, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") setEmailError(false);
    if (name === "name") setNameError(false);
  };

  const handleDropMouse = () => {
    if (
      formData?.name.trim().length <= 1 ||
      formData?.email.trim().length <= 1 ||
      (user?.name === formData?.name && user?.email === formData?.email)
    ) {
      setNoDrop(true);
    } else {
      setNoDrop(false);
    }
  };

  const closeDialog = () => {
    setModalOpen(false);
  };

  const handleImageChange = async (e) => {
    const image = e.target.files[0];
    const fd = new FormData();
    fd.append("image", image);

    setLoading(true);
    try {
      const { user } = await editUserImage(fd, formData.id);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setFormData({
        ...formData,
        image: user.image_path,
      });
    } catch (err) {
      ErrorAlert("This information cannot be updated, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoadingAlert(true);
    try {
      const formData = { tokenable_id: user.id };
      await deleteUser(formData);
      logout();
    } catch (err) {
      ErrorAlert("This User could not be deleted, please try again");
    } finally {
      setLoadingAlert(false);
    }
  };

  if (loading)
    return (
      <div className="center-loading">
        <div className="loader"></div>
      </div>
    );

  return (
    <>
      <article className="setting-title">
        <div className="content-title">
          <h2>Setting </h2>
          <p>You can view your account settings</p>
        </div>
        <div className="avater">
          <img
            src={
              formData.image
                ? `https://to-do-list.sintac.site/${formData.image}`
                : avater
            }
            alt="Avater"
          />
          <div className="container-edit-icon">
            <input
              type="file"
              accept="image/*"
              name="file"
              onChange={handleImageChange}
              id="upload-input"
            />
            <EditIcon className="edit bottom-icon" />
          </div>
        </div>
      </article>

      <article className="settin-content">
        <div className="setting-body">
          <h3>Personal details</h3>
          <hr />
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Ful Name</label>
            <input
              type="text"
              value={formData.name}
              name="name"
              id="name"
              placeholder="Edit your name"
              onChange={handleInputChange}
            />
            {nameError && <p className="mes-error">Not Invalid Name</p>}

            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={formData.email}
              name="email"
              id="email"
              placeholder="Edit your email"
              onChange={handleInputChange}
            />
            {emailError && (
              <p className="mes-error">Invalid email enter example@gmail.com</p>
            )}
            <button
              type="submit"
              className={`btn-edit settin-btn ${noDrop ? "no-drop" : ""}`}
              onMouseOver={handleDropMouse}
              // disabled={loading}
            >
              Edit
            </button>
            <button
              className="btn-delete settin-btn"
              onClick={() => setModalOpen(true)}
            >
              Delete Account
            </button>
          </form>
        </div>
      </article>

      {modalOpen && (
        <AlertModel
          closeDialog={closeDialog}
          handleDelete={handleDelete}
          content="Are you sure you want to delete the Account?"
          loadingAlert={loadingAlert}
        />
      )}
    </>
  );
}
