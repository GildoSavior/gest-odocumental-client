document.addEventListener("DOMContentLoaded", async () => {
    const tableWrapper = document.querySelector(".table-wrapper");
    const emptyContentDiv = document.querySelector(".sem-conteudo");
    
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
        const documents = res.data
             

        if (!documents || documents.length === 0) {
            
            emptyContentDiv.style.display = "block";
            tableWrapper.style.display = "none";
            return;
        }

        emptyContentDiv.style.display = "none";
        tableWrapper.style.display = "block";
        tableWrapper.innerHTML = ""; 

        documents.forEach(doc => {
            const docHtml = `
                <div class="document-wrapper">
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
                        <a href="#" class="action-link w-inline-block">
                            <div class="text-block-115 _800">f</div>
                            <div class="text-block-116">Log</div>
                        </a>
                        <a href="#" class="action-link w-inline-block">
                            <div class="text-block-115">2</div>
                            <div class="text-block-116">Partilhar</div>
                        </a>
                        <a href="#" class="action-link w-inline-block">
                            <div class="text-block-115">8</div>
                            <div class="text-block-116">Apagar</div>
                        </a>
                    </div>
                </div>`;
            tableWrapper.innerHTML += docHtml;
        });

    } catch (error) {
        console.error("Erro ao buscar os documentos:", error);
        emptyContentDiv.style.display = "block";
        tableWrapper.style.display = "none";
    }
});
