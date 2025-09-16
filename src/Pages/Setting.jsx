import { useEffect, useState } from "react";
import avater from "../images/avater.png";
import "../styles/setting.css";
import EditIcon from "../Icons/EditIcon";
import AlertModel from "../components/AlertModel";
import { UseGlobalUser } from "../auth/AuthUser";
import ErrorAlert from "../components/ErrorAlert";
import { account, APPWRITE_BUCKET_ID, storage } from "../lib/appwrite";
import ConfirmPasswordModal from "../components/ConfirmPasswordModal";
import { ID } from "appwrite";
import { useTranslation } from "react-i18next";
import HeaderPage from "../components/HeaderPage";

export default function Setting() {
  const { user, logout, setUser, getInitialUserValue, getFileViewURL } =
    UseGlobalUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAlert, setLoadingAlert] = useState(false);
  const [noDrop, setNoDrop] = useState(true);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image_path,
    currentPassword: "",
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
      email.split("@")[0].length < 3 || // The number of letters in the name must be at least 5
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

    if (formData.email !== user.email) {
      setPendingData({ ...formData });
      setShowPasswordModal(true);
      return;
    }

    await updateProfile({ name: formData.name });
  };

  const updateProfile = async ({ name, email, password }) => {
    setLoading(true);
    try {
      if (name && name !== user.name) {
        await account.updateName(name);
      }

      if (email && email !== user.email && password) {
        await account.updateEmail({ email, password });
      }

      getInitialUserValue();
    } catch (err) {
      ErrorAlert("This information cannot be updated, please try again");
    } finally {
      setLoading(false);
      setShowPasswordModal(false);
      setPendingData(null);
    }
  };

  const handleConfirmPassword = async (password) => {
    if (!pendingData) return;
    await updateProfile({
      name: pendingData.name,
      email: pendingData.email,
      password,
    });
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
    if (!image) return;

    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem("user")) || user; // user state fallback

      const file = await storage.createFile({
        bucketId: APPWRITE_BUCKET_ID,
        fileId: ID.unique(),
        file: image,
      });

      const oldFileId = currentUser?.prefs?.profileImage; // if you stored it there previously
      if (oldFileId && oldFileId !== file.$id) {
        try {
          await storage.deleteFile({
            bucketId: APPWRITE_BUCKET_ID,
            fileId: oldFileId,
          });
        } catch (err) {
          console.warn("Could not delete old file:", err);
        }
      }

      const updatedAccount = await account.updatePrefs({
        ...(currentUser?.prefs || {}),
        profileImage: file.$id,
      });

      const updatedUser = {
        ...(currentUser || {}),
        prefs: updatedAccount.prefs,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, image: getFileViewURL(file.$id) }));
    } catch (err) {
      ErrorAlert("This information cannot be updated, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoadingAlert(true);
    try {
      await logout();
    } catch (err) {
      ErrorAlert("This User could not be deleted, please try again");
    } finally {
      setLoadingAlert(false);
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.prefs?.profileImage) {
      setFormData((prev) => ({
        ...prev,
        image: getFileViewURL(stored.prefs.profileImage),
      }));
    } else {
      const image_path = stored?.image_path;
      setFormData((prev) => ({
        ...prev,
        image: image_path,
      }));
    }
  }, [getFileViewURL]);

  if (loading)
    return (
      <div className="center-loading">
        <div className="loader"></div>
      </div>
    );

  return (
    <section>
      <article className="setting-title">
        <HeaderPage title={"profile"} subTitle={"settingsInfo"} />

        <div className="avater">
          <img src={formData.image ? formData.image : avater} alt="Avater" />
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
          <h3>{t("personalDetails")}</h3>
          <hr />
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">{t("fullName")}</label>
            <input
              type="text"
              value={formData.name}
              name="name"
              id="name"
              placeholder={t("editName")}
              onChange={handleInputChange}
            />
            {nameError && <p className="mes-error">{t("invalidName")}</p>}

            <label htmlFor="email">{t("email")}</label>
            <input
              type="email"
              value={formData.email}
              name="email"
              id="email"
              placeholder={t("editEmail")}
              onChange={handleInputChange}
            />
            {emailError && <p className="mes-error">{t("invalidEmail")}</p>}
            <button
              type="submit"
              className={`btn-edit settin-btn ${noDrop ? "no-drop" : ""}`}
              onMouseOver={handleDropMouse}
            >
              {t("edit")}
            </button>
            <button
              className="btn-delete settin-btn"
              onClick={() => setModalOpen(true)}
            >
              {t("deleteAccount")}
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

      {showPasswordModal && (
        <ConfirmPasswordModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handleConfirmPassword}
          loading={loading}
        />
      )}
    </section>
  );
}
