
document.addEventListener("DOMContentLoaded", function () {

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Obter o ID da URL
    const id = getQueryParam("id");
    const pastaLink = document.getElementById("linkPasta");
    const documentoLink = document.getElementById("linkDocumento");

    if (pastaLink) {
        pastaLink.addEventListener("click", function (e) {
            e.preventDefault();

            if (id) {
                window.location.href = `/pastas/criar-sub-pasta.html?parentFolderId=${id}`;
            } else {
                alert("ID da pasta não encontrado na URL.");
            }
        });
    }

    if (documentoLink) {
        documentoLink.addEventListener("click", function (e) {
            e.preventDefault();

            if (id) {
                window.location.href = `/documento/criar-documento.html?parentFolderId=${id}`;
            } else {
                alert("ID da pasta não encontrado na URL.");
            }
        });
    }

   
});
