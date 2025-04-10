import { BASE_URL } from '../config.js';

document.addEventListener("DOMContentLoaded", async () => {
    const tableWrapper = document.querySelector(".table-wrapper");
    const emptyContentDiv = document.querySelector(".sem-conteudo");
    const logDiv = document.getElementById("logDiv");
    const shareDiv = document.getElementById("shareDiv");

    const certeza = document.querySelector(".certeza");
    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    isLoading = () => {
        loading.style.display = "block";
    }

    closeLoading = () => {
        loading.style.display = "none";
    }

    const token = localStorage.getItem("jwtToken");
    const urlParams = new URLSearchParams(window.location.search);
    const folderId = urlParams.get("id");

    if (!token) {
        console.error("Token de autenticação não encontrado!");
        emptyContentDiv.style.display = "block";
        tableWrapper.style.display = "none";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/files/folder/${folderId}`, {
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
                    <a href="#" class="action-link w-inline-block share-btn" data-ix="share-appear"
                         data-file-path= "${doc.filePath}" 
                         data-file-name= "${doc.name}" 
                         data-file-date= " ${new Date(doc.createdAt).toLocaleDateString()}"
                         data-file-id= "${doc.id}"
                         >
                        <div class="text-block-115">2</div>
                        <div class="text-block-116">Partilhar</div>
                    </a>
                    <a href="#" class="action-link w-inline-block delete-btn"  data-file-id= "${doc.id}">
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
                    const logResponse = await fetch(`${BASE_URL}/logs/file/${fileId}`, {
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

                const filePath = event.currentTarget.getAttribute("data-file-path");
                const fileId = event.currentTarget.getAttribute("data-file-id");
                const fileName = event.currentTarget.getAttribute("data-file-name");
                const fileDate = event.currentTarget.getAttribute("data-file-date");

                const docName = document.querySelector(".doc-name-copy .text-block-114-copy");
                docName.textContent = `${fileName} (${fileDate})`;

                shareDiv.style.display = "block";

                const shareForm = document.getElementById("share-document-form");

                const clonedForm = shareForm.cloneNode(true);
                shareForm.parentNode.replaceChild(clonedForm, shareForm);

                clonedForm.addEventListener("submit", async (submitEvent) => {
                    submitEvent.preventDefault();

                    document.querySelector(".w-form-done").style.display = "none";
                    document.querySelector(".w-form-fail").style.display = "none";

                    const email = document.getElementById("email").value;
                    const password = document.getElementById("document-password").value;

                    // Fazer fetch do arquivo
                    const file = await fetch(filePath)
                        .then(response => {
                            if (!response.ok) throw new Error("Erro ao buscar o arquivo.");
                            return response.blob();
                        })
                        .catch(error => {
                            console.error("Erro ao obter o arquivo:", error);
                            const errorDiv = document.querySelector(".w-form-fail");
                            errorDiv.style.display = "block";
                            errorDiv.querySelector("div").textContent = "Erro ao obter o arquivo. Tente novamente!";
                            return null;
                        });

                    if (!file) return;

                    const filePathParts = filePath.split('/');
                    const extractedFileName = filePathParts[filePathParts.length - 1].split('?')[0];  // Ex: "Documento Teste_1744022293789.png"

                    // Criar FormData e incluir o nome correto do arquivo
                    const formData = new FormData();
                    const fileWithCorrectName = new File([file], extractedFileName, { type: file.type });

                    formData.append("file", fileWithCorrectName);  // Usando o nome extraído do caminho
                    formData.append("email", email);
                    formData.append("password", password);

                    try {
                        const response = await fetch(`${BASE_URL}/mails/sendDocument/${fileId}`, {
                            method: "POST",
                            body: formData,
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        });

                        const result = await response.json(); // Lê o JSON com `message`, `ok`, `data`

                        if (response.ok && result.ok) {
                            const successDiv = document.querySelector(".w-form-done");
                            successDiv.style.display = "block";
                            successDiv.querySelector("div").textContent = result.message || "Documento enviado com sucesso!";

                            setTimeout(() => {
                                shareDiv.style.display = "none";
                            }, 1000);
                        } else {
                            const errorDiv = document.querySelector(".w-form-fail");
                            errorDiv.style.display = "block";
                            errorDiv.querySelector("div").textContent = result.message || "Erro ao enviar o documento.";
                        }
                    } catch (error) {
                        console.error("Erro ao enviar o documento:", error);
                        const errorDiv = document.querySelector(".w-form-fail");
                        errorDiv.style.display = "block";
                        errorDiv.querySelector("div").textContent = "Erro ao enviar o documento. Tente novamente!";
                    }
                });
            });
        });

        let fileIdToDelete = null;

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", (event) => {
                event.preventDefault();

                fileIdToDelete = event.currentTarget.getAttribute("data-file-id");
                certeza.style.display = "block";
            });
        });

        document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {

            certeza.style.display = "none";
            isLoading();

            if (!fileIdToDelete) return;

            try {
                const response = await fetch(`${BASE_URL}/files/${fileIdToDelete}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    closeLoading();
                    erro.style.display = "block";
                    const errorData = await response.json(); // pega a resposta JSON com a mensagem
                    erro.querySelector(".paragraph-2").textContent = errorData.message || "Ocorreu um erro, por favor tente novamente!";
                    return;
                }

                const res = await response.json();
                closeLoading();
                sucesso.style.display = "block";
                window.location.reload();
            } catch (error) {
                closeLoading();
                erro.style.display = "block";
                console.error("Erro ao apagar o documento:", error);
                erro.querySelector(".paragraph-2").textContent = error.message || "Ocorreu um erro, por favor tente novamente!";
            } finally {
                certeza.style.display = "none";
                fileIdToDelete = null;
            }
        });
        // Evento para fechar a div de log
    } catch (error) {
        console.error("Erro ao buscar os documentos:", error);
        emptyContentDiv.style.display = "block";
        tableWrapper.style.display = "none";
    }
});
