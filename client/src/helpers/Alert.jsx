import Swal from "sweetalert2";
export default function Alert(data) {
  console.log(data, "<== didalam alert");

  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: data,
  });
}
