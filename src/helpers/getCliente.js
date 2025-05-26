import Swal from "sweetalert2";

export const getCliente = async () => {

    const { value: cc } = await Swal.fire({
      title: "Asignar cliente",
      text: "Ingrese el documento del cliente:",
      input: "text",
      inputPlaceholder: "Documento",
      showCancelButton: true,
      confirmButtonText: "Buscar cliente",
      cancelButtonText: "Cancelar"
    });

    if (!cc) return;

  try {
    
    const response = await fetch(`https://localhost:44376/api/Clientes/ConsultarXCC?CC=${cc}`);

    const cliente = await response.json();
    if (!cliente || !cliente.IdCliente) {
      Swal.fire("No encontrado", "No se encontró ningún cliente con ese valor.", "error");

      return null;
    }
    return cliente;

    } catch (error) {
      console.error("Error buscando cliente:", error);
      Swal.fire("Error", "Hubo un problema al buscar el cliente.", "error");
    }
  };