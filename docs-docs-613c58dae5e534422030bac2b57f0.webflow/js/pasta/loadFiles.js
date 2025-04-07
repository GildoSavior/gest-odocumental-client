document.addEventListener("DOMContentLoaded", async () => {
    const tableWrapper = document.querySelector(".table-wrapper");
    const emptyContentDiv = document.querySelector(".sem-conteudo");
    const logDiv = document.getElementById("logDiv");
    const shareDiv = document.getElementById("shareDiv");

    const token = localStorage.getItem("jwtToken");
    const folderId = localStorage.getItem("selectedFolderId");

    if (!token) {
        console.error("Token de autenticação não encontrado!");
        emptyContentDiv.style.display = "block";
        tableWrapper.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/files/folder/${folderId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Falha ao carregar os documentos.`);
        }

        const res = await response.json();
        const documents = res.data;

        if (!documents || documents.length === 0) {
            emptyContentDiv.style.display = "block";
            tableWrapper.style.display = "none";
            return;
        }

        emptyContentDiv.style.display = "none";
        tableWrapper.style.display = "block";
        tableWrapper.innerHTML = "";

        const docFragment = document.createDocumentFragment();
        documents.forEach(doc => {
            const docWrapper = document.createElement("div");
            docWrapper.className = "document-wrapper";
            docWrapper.innerHTML = `
                <div class="docs-contents">
                    <div class="img-def-doc"><div class="if-pdf"></div></div>
                    <div class="doc-name">
                        <div class="text-block-114">${doc.name} (${doc.year})</div>
                    </div>
                    <div class="data-do-doc">
                        <div class="data-contnt">${new Date(doc.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="ations-wrapper">
                    <a href="" class="action-link w-inline-block ver-btn" target="_blank" 
                        data-file-path="${doc.filePath}" 
                        data-file-id="${doc.id}" 
                        data-file-date="${new Date(doc.createdAt).toLocaleDateString()}"
                        data-file-password="${doc.password ? doc.password : ''}">
                        <div class="text-block-115">3</div>
                        <div class="text-block-116">Ver</div>
                    </a>
                    <a href="../documento/editar-documento.html?file=${doc.id}" class="action-link w-inline-block">
                        <div class="text-block-115 _900">k</div>
                        <div class="text-block-116">Editar</div>
                    </a>
                    <a href="#" class="action-link w-inline-block log-btn" data-file-id="${doc.id}" >
                        <div class="text-block-115 _800">f</div>
                        <div class="text-block-116">Log</div>
                    </a>
                    <a href="#" class="action-link w-inline-block share-btn" data-ix="share-appear" data-file-path="${doc.filePath}" data-file-name="${doc.name}" data-file-date =" ${new Date(doc.createdAt).toLocaleDateString()}">
                        <div class="text-block-115">2</div>
                        <div class="text-block-116">Partilhar</div>
                    </a>
                    <a href="#" class="action-link w-inline-block">
                        <div class="text-block-115">8</div>
                        <div class="text-block-116">Apagar</div>
                    </a>
                </div>
            `;
            docFragment.appendChild(docWrapper);
        });

        tableWrapper.appendChild(docFragment);

        document.querySelectorAll(".ver-btn").forEach(btn => {
            btn.addEventListener("click", async (event) => {
                event.preventDefault();
                
                const filePath = event.currentTarget.getAttribute("data-file-path");
                const fileId = event.currentTarget.getAttribute("data-file-id");

                localStorage.setItem("selectedFileId", fileId);
                localStorage.setItem("selectedFilePath", filePath);
                
                const password = event.currentTarget.getAttribute("data-file-password") || "";
                if (!password || password.trim() === "") {                    
                    window.open(filePath, "_blank"); // Abre o arquivo diretamente
                    return;
                }          

                const passwordWrapper = document.querySelector(".password-wrapper");
                if (passwordWrapper) {
                    passwordWrapper.style.display = "block";
                }
            });
        });

        document.querySelectorAll(".log-btn").forEach(btn => {
            btn.addEventListener("click", async (event) => {
                event.preventDefault();

                const fileId = event.currentTarget.getAttribute("data-file-id");

                try {
                    const logResponse = await fetch(`http://localhost:8080/api/logs/file/${fileId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!logResponse.ok) {
                        throw new Error(`Erro ${logResponse.status}: Falha ao carregar os logs.`);
                    }

                    const logData = await logResponse.json();

                    // Limpa os logs antigos antes de adicionar os novos
                    logDiv.querySelector(".div-block-100").innerHTML = "";

                    if (logData.data.length > 0) {
                        logData.data.forEach(log => {
                            const logEntry = document.createElement("div");
                            logEntry.className = "log-content-div";
                            logEntry.innerHTML = `
                                <div class="nome-da-pessoa">${log.userName}</div>
                                <div class="text-block-118">${new Date(log.timestamp).toLocaleString()}</div>
                                <div>${log.details}</div>
                            `;
                            logDiv.querySelector(".div-block-100").appendChild(logEntry);
                        });

                        logDiv.style.display = "block";
                    } else {
                        alert("Nenhum log encontrado para este documento.");
                    }
                } catch (error) {
                    console.error("Erro ao buscar os logs:", error);
                }
            });
        });

        document.querySelectorAll(".share-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();

                // Obtenha os dados do arquivo
                const filePath = event.currentTarget.getAttribute("data-file-path");
                const fileName = event.currentTarget.getAttribute("data-file-name");
                const fileDate = event.currentTarget.getAttribute("data-file-date");

                // Exibe os detalhes do documento na UI
                const docName = document.querySelector(".doc-name-copy .text-block-114-copy")
                docName.textContent = `${fileName} (${fileDate})`;

                // Exibe a div de compartilhamento
                shareDiv.style.display = "block";

                // Quando o formulário for enviado
                const shareForm = document.getElementById("share-document-form");
                shareForm.addEventListener("submit", async (submitEvent) => {
                    submitEvent.preventDefault();

                    const email = document.getElementById("email").value;
                    const password = document.getElementById("password").value;

                    // Aqui, você precisará buscar o arquivo no servidor, dado o `filePath`.
                    // Supondo que você consiga obter o arquivo no backend e usá-lo como um Blob:

                    const file = await fetch(filePath)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Erro ao buscar o arquivo.");
                            }
                            return response.blob(); // Converte o conteúdo da resposta para um Blob
                        })
                        .catch(error => {
                            console.error("Erro ao obter o arquivo:", error);
                            alert("Erro ao obter o arquivo. Tente novamente.");
                            return null;
                        });

                    if (!file) return; // Se não conseguimos o arquivo, aborta

                    // Cria o FormData para enviar os dados
                    const formData = new FormData();
                    formData.append("file", file); // Envia o arquivo
                    formData.append("email", email); // Envia o email
                    formData.append("password", password); // Envia a senha

                    try {
                        // Envia os dados para o controller de envio de email
                        const response = await fetch("http://localhost:8080/api/mails/sendDocument", {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        });

                        if (response.ok) {
                            alert("Documento enviado com sucesso!", response.message);
                            shareDiv.style.display = "none";
                        } else {
                            alert("Erro ao enviar o documento. Tente novamente!");
                        }
                    } catch (error) {
                        console.error("Erro ao enviar o documento:", error);
                        alert("Erro ao enviar o documento. Tente novamente!");
                    }
                });
            });
        });



        // Evento para fechar a div de log
    } catch (error) {
        console.error("Erro ao buscar os documentos:", error);
        emptyContentDiv.style.display = "block";
        tableWrapper.style.display = "none";
    }
});
