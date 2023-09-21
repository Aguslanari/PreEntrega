const showErrorMessage = (mensaje, confirmButtonText = 'OK') => showMessage(mensaje, 'error', confirmButtonText)

const showSuccessMessage = (mensaje, confirmButtonText = 'OK') => showMessage(mensaje, 'success', confirmButtonText)

const showMessage = (mensaje, icon, confirmButtonText = 'OK') => {
    return Swal.fire({
        icon,
        title: mensaje,
        showConfirmButton: true,
        allowOutsideClick: false,
        confirmButtonText,
        confirmButtonColor: '#007bff',
        confirButtonHoverColor: '#0056b3',
    })
}

export { showErrorMessage, showSuccessMessage }