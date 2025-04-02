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
                    <a href="${doc.filePath}" class="action-link w-inline-block" target="_blank">
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
                    <a href="#" class="action-link w-inline-block share-btn" data-ix="share-appear" data-file-name="${doc.name}" data-file-date =" ${new Date(doc.createdAt).toLocaleDateString()}">
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

                const fileName = event.currentTarget.getAttribute("data-file-name");
                const fileDate = event.currentTarget.getAttribute("data-file-date");

                const docName = document.querySelector(".doc-name-copy .text-block-114-copy")
                docName.textContent = fileName + " (" + fileDate + ")";

                shareDiv.style.display = "block"; // Exibe a div de compartilhamento
            });
        });

        // Evento para fechar a div de log
    const closeLogBtn = document.querySelector(".link-16");
        if (closeLogBtn && logDiv) {
            closeLogBtn.addEventListener("click", (event) => {
                event.preventDefault();
                logDiv.style.display = "none";
            });
        }



    } catch (error) {
        console.error("Erro ao buscar os documentos:", error);
        emptyContentDiv.style.display = "block";
        tableWrapper.style.display = "none";
    }
});
