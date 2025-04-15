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

    const container = document.querySelector(".section-4 .container");
 
    const token = localStorage.getItem("jwtToken");

    function fetchFolders() {

        isLoading()

        if (!token) {
            closeLoading();
            erro.style.display = "block";
            erro.querySelector(".paragraph-2").textContent = "Token de autenticação não encontrado!";
            return;
        }

        fetch(`${BASE_URL}/folders`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Enviando o token no header
                "Content-Type": "application/json"
            },
            credentials: "include" // Inclui cookies de autenticação se necessário
        })
            .then(response => {
                if (!response.ok) {
                    closeLoading();
                    erro.style.display = "block";
                    erro.querySelector(".paragraph-2").textContent = `Erro ${response.status}: Falha ao carregar as pastas.`;
                }
                return response.json();
            })
            .then(data => {
                if (data.ok && data.data) {
                    renderFolders(JSON.parse(JSON.stringify(data.data.content)));
                    closeLoading();
                } else {
                    closeLoading();
                    erro.style.display = "block";
                    erro.querySelector(".paragraph-2").textContent = `Erro ${data.message}: Falha ao carregar as pastas.`;
                }
            })
            .catch(error => {
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = `Falha ao conectar com o servidor: ${error.message}`;                
            });
    }

    // Função para renderizar as pastas no HTML
    function renderFolders(folders) {
        const selectedYear = localStorage.getItem("selectedFilterYear");
    
        // Filtra as pastas se tiver um ano selecionado
        const filteredFolders = selectedYear
            ? folders.filter(folder => String(folder.year) === selectedYear)
            : folders;
    
        container.innerHTML = ""; // Limpa o container
    
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("w-clearfix");
    
        filteredFolders.forEach((folder, index) => {
            let folderElement = document.createElement("a");
            folderElement.classList.add("pasta-link", "w-inline-block");
    
            folderElement.innerHTML = `
                <div class="div-block-56"></div>
                <h4 class="heading">${folder.name}</h4>
            `;
    
            folderElement.addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.setItem("selectedFolderId", folder.id);
                localStorage.setItem("selectedFolderName", folder.name);
                localStorage.setItem("selectedFolderYear", folder.year);
                localStorage.setItem("selectedFolderPassword", folder.password);
    
                if (!folder.password || folder.password.trim() === "") {
                    window.location.href = `pastas/inside-folder.html?id=${folder.id}`;
                    return;
                }
    
                const passwordWrapper = document.querySelector(".password-wrapper");
                if (passwordWrapper) {
                    passwordWrapper.style.display = "block";
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
    

    // Chamar a função ao carregar a página
    fetchFolders();
});
