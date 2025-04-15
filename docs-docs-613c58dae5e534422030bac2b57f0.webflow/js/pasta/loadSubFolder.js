document.addEventListener("DOMContentLoaded", function () {

    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => {
        loading.style.display = "block";
    }

    const closeLoading = () => {
        loading.style.display = "none";
    }
    const noContent = document.querySelector(".sem-conteudo");

    const token = localStorage.getItem("jwtToken");

    const urlParams = new URLSearchParams(window.location.search);
    const selectedFolderId = urlParams.get("id");

    const folderName = localStorage.getItem("selectedFolderName") || "Pasta desconhecida";
    const folderYear = localStorage.getItem("selectedFolderYear") || "Ano desconhecido";
    const container = document.querySelector(".section-4 .container .sub-folders");

    // const breadcrumb = document.querySelector(".text-block-113");

    // if (breadcrumb) {
    //     breadcrumb.textContent = `Início > ${folderYear} > ${folderName}`;
    // }

    function fetchFolders() {

        isLoading();
        if (!token) {
            console.error("Token de autenticação não encontrado!");
            return;
        }

        // Exibir um indicador de carregamento
        container.innerHTML = "<p>Carregando pastas...</p>";

        fetch(`${BASE_URL}/folders/${selectedFolderId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    closeLoading();
                    erro.style.display = "block";
                    erro.querySelector(".paragraph-2").textContent = "Erro " + response.status + ": Falha ao carregar as subpastas.";
                }
                closeLoading();
                return response.json();
            })
            .then(data => {
                if (data.ok && data.data) {
                    closeLoading();
                    renderFolders(data.data.content);
                } else {
                    closeLoading();
                    erro.style.display = "block";
                    erro.querySelector(".paragraph-2").textContent = "Erro: Falha ao carregar as pastas." + data.message;

                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = "Erro na requisição:" + error.message;
            });
    }

    function renderFolders(folders) {
        // Garantir que todas as pastas antigas sejam removidas antes de adicionar novas
        container.innerHTML = "";

        const titleElement = document.createElement("h4");
        titleElement.classList.add("heading-12");
        titleElement.textContent = "Subpastas";
        container.appendChild(titleElement);

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("w-clearfix");


        folders.forEach((folder, index) => {
            let folderElement = document.createElement("a");
            // folderElement.href = `inside-sub-folder.html?id=${folder.id}`;
            folderElement.classList.add("pasta-link", "w-inline-block");

            folderElement.innerHTML = `
                <div class="div-block-56"></div>
                <h4 class="heading">${folder.name}</h4>
            `;

            folderElement.addEventListener("click", function () {

                localStorage.setItem("selectedFolderYear", folder.year);
                localStorage.setItem("selectedSubFolderYear", folder.year);
                localStorage.setItem("selectedFolderPassword", folder.password);
                localStorage.setItem("selectedFolderId", folder.id);
                localStorage.setItem("selectedSubFolderName", folder.name);

                // Verifica se o usuário está tentando acessar uma subpasta sem senha
                if (!folder.password || folder.password.trim() === "") {
                    window.location.href = `inside-sub-folder.html?id=${folder.id}`;
                    return;
                }

                const passwordWrapper = document.querySelector(".password-wrapper");
                if (passwordWrapper) {
                    passwordWrapper.style.display = "block";  // Torna o passwordWrapper visível
                }


            });

            rowDiv.appendChild(folderElement);

            if ((index + 1) % 4 === 0) {
                container.appendChild(rowDiv);
                rowDiv = document.createElement("div");
                rowDiv.classList.add("w-clearfix");
            }
        });

        if (rowDiv.children.length > 0) {
            container.appendChild(rowDiv);
        }
    }

    fetchFolders();
});
