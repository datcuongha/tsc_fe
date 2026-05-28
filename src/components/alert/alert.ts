import Swal from "sweetalert2";

import type { swalTypeProps } from "./type";

export const showAlert = ({ type = "error", message }: swalTypeProps) => {
    Swal.fire({
        icon: type === "error" ? "error" : "success", // ✅ Thành công thì tick xanh
        title: type === "error" ? "Lỗi" : "Thành công", text: message,
        position: "bottom-right",
        toast: true,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        customClass: {
            container: "swal-container",
            popup: "swal-popup",
        },
        didOpen: () => {
            // Đảm bảo Swal luôn trên modal
            const swalContainer = document.querySelector(".swal2-container") as HTMLElement;
            if (swalContainer) swalContainer.style.zIndex = "2000"; // MUI modal thường z-index 1300
        }
    });
};

export const capitalizeFirstLetter = (text: string) =>
    text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');




