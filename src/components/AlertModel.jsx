/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import DeleteIcon from "../Icons/DeleteIcon";

export default function AlertModel({
  closeDialog,
  handleDelete,
  todoId,
  content,
  loadingAlert,
}) {
  const { t } = useTranslation();

  return (
    <div className="back">
      <div className="allert">
        <div className="top-allert">
          <DeleteIcon className="end-trash" size={40} />
          <h2 className="msg-sure">{content}</h2>
        </div>
        <div className="bottom-allert">
          <button className="btn-sure cancel" onClick={closeDialog}>
            {t("cancel")}
          </button>
          <button
            className="btn-sure delete"
            onClick={() => handleDelete(todoId)}
            disabled={loadingAlert}
          >
            {t("delete")}
          </button>
        </div>
        {loadingAlert && (
          <div className="container-loader">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
}
