
document.addEventListener("DOMContentLoaded", function () {

    const BASE_URL = window.BASE_URL || 'http://localhost:8080/api';

    const certeza = document.querySelector(".certeza");
    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => {
        loading.style.display = "block";
    }

    const closeLoading = () => {
        loading.style.display = "none";
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const id = getQueryParam("id");
    const pastaLink = document.getElementById("linkPasta");
    const documentoLink = document.getElementById("linkDocumento");
    const linkDelete = document.getElementById("linkDelete");
 

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

    
    if (linkDelete) {
        linkDelete.addEventListener("click", function (e) {
            e.preventDefault();

            certeza.style.display = "block";
        });
    }


    document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {

        const token = localStorage.getItem("jwtToken");

        certeza.style.display = "none";
        isLoading();

        if (!id) return;

        try {

            
            const response = await fetch(`${BASE_URL}/folders/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                closeLoading();
                erro.style.display = "block";
                const errorData = await response.json();
                erro.querySelector(".paragraph-2").textContent = errorData.message || "Ocorreu um erro, por favor tente novamente!";
                return;
            }

            const res = await response.json();
            closeLoading();
            sucesso.style.display = "block";
            setTimeout(() => {
                window.location.href = `main-dashboard.html`;                
            }, 1000)
            window.location.reload();

        } catch (error) {
            closeLoading();
            erro.style.display = "block";
            console.error("Erro ao apagar o documento:", error);
            erro.querySelector(".paragraph-2").textContent = error.message || "Ocorreu um erro, por favor tente novamente!";
        } finally {
            certeza.style.display = "none";
        }
    });


});
