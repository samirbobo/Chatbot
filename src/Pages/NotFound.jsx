import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="not-found-page">
      <h1>{t("notFoundTitle")}</h1>
      <h2>{t("notFoundSubtitle")}</h2>

      <p>
        {t("notFoundMessage")}{" "}
        <Link to="/" style={{ color: "#036666", fontWeight: "bold" }}>
          {t("redirectPage")}
        </Link>
      </p>
    </section>
  );
}
