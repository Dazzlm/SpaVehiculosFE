import Swal from "sweetalert2";

export const getCliente = async () => {
  const { value: cc } = await Swal.fire({
    title: "Asignar cliente",
    text: "Ingrese el documento del cliente:",
    input: "text",
    inputPlaceholder: "Documento",
    showCancelButton: true,
    confirmButtonText: "Buscar cliente",
    cancelButtonText: "Cancelar",
  });

  if (!cc) return null;

  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user?.token) {
      Swal.fire("Error", "No estás autenticado.", "error");
      return null;
    }

    const response = await fetch(
      `https://spavehiculos.runasp.net/api/Clientes/ConsultarXCC?CC=${cc}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const cliente = await response.json();

    if (!cliente.Data || !cliente.Data.IdCliente) {
      Swal.fire(
        "No encontrado",
        "No se encontró ningún cliente con ese valor.",
        "error"
      );
      return null;
    }

    return cliente.Data;
  } catch (error) {
    console.error("Error buscando cliente:", error);
    Swal.fire("Error", "Hubo un problema al buscar el cliente.", "error");
    return null;
  }
};
