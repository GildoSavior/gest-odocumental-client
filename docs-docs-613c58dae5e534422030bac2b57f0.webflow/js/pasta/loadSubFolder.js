document.addEventListener("DOMContentLoaded", function () {
    //const container = document.querySelector(".section-4 .container .heading-12");
    const container = document.querySelector(".section-4 .container .sub-folders");


    const token = localStorage.getItem("jwtToken");
    const selectedFolderId = localStorage.getItem("selectedFolderId");

    const folderName = localStorage.getItem("selectedFolderName") || "Pasta desconhecida";
    const folderYear = localStorage.getItem("selectedFolderYear") || "Ano desconhecido";

    const breadcrumb = document.querySelector(".text-block-113");
    if (breadcrumb) {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName}`;
    }

    function fetchFolders() {
        if (!token) {
            console.error("Token de autenticação não encontrado!");
            return;
        }

        // Exibir um indicador de carregamento
        container.innerHTML = "<p>Carregando pastas...</p>";

        fetch(`http://localhost:8080/api/folders/${selectedFolderId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: Falha ao carregar as subpastas.`);
                }
                return response.json();
            })
            .then(data => {
                if (data.ok && data.data) {
                    renderFolders(data.data.content);
                } else {
                    console.error("Erro ao carregar as pastas:", data.message);
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                container.innerHTML = "<p>Erro ao carregar pastas.</p>";
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
