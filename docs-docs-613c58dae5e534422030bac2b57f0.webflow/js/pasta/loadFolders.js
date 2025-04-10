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

    // Recuperar o token do localStorage
    const token = localStorage.getItem("jwtToken");

    // Função para buscar as pastas da API
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

        const foldersCopy1 = folders.map(folder => ({ ...folder }));

        container.innerHTML = ""; // Limpa o container antes de adicionar novos itens

        let rowDiv = document.createElement("div");
        rowDiv.classList.add("w-clearfix");

        foldersCopy1.forEach((folder, index) => {

            console.log("Dentro do forEach:", JSON.stringify(folder));
            let folderElement = document.createElement("a");
            // folderElement.href = `pastas/inside-folder.html?id=${folder.id}`;
            // // folderElement.href = `../../main-dashboard.html`;
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
                    passwordWrapper.style.display = "block";  // Torna o passwordWrapper visível
                }




            });

            rowDiv.appendChild(folderElement);

            // A cada 4 elementos, criamos uma nova linha para manter a organização
            if ((index + 1) % 4 === 0) {
                container.appendChild(rowDiv);
                rowDiv = document.createElement("div");
                rowDiv.classList.add("w-clearfix");
            }
        });


        // Adiciona a última linha se não estiver vazia
        if (rowDiv.children.length > 0) {
            container.appendChild(rowDiv);
        }
    }

    // Chamar a função ao carregar a página
    fetchFolders();
});
