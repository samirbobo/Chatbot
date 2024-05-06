import Swal from "sweetalert2";

export default function ErrorAlert(text) {
  return Swal.fire({
    position: "top",
    title: "Error 404",
    text: text,
    showClass: {
      popup: `
      animate__animated
      animate__fadeInUp
      animate__faster`,
    },
    hideClass: {
      popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster`,
    },
  });
}
