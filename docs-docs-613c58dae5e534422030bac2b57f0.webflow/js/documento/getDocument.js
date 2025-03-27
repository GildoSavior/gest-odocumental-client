document.addEventListener("DOMContentLoaded", async function () {
    // Função para obter parâmetros da URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Obtém o ID do arquivo da URL
    const fileId = getQueryParam("file");
    if (!fileId) {
        console.error("Nenhum fileId encontrado na URL.");
        return;
    }


    const token = localStorage.getItem("jwtToken");    

    // URL da API
    const apiUrl = `http://localhost:8080/api/files/${fileId}`;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar os dados do documento.");
        }

        const result = await response.json();
        if (!result.ok) {
            throw new Error(result.message || "Erro na resposta da API.");
        }

        const data = result.data;        

        // Preenchendo os campos do formulário
        document.getElementById("name").value = data.name || "";
        document.getElementById("password").value = data.password || "";
        document.getElementById("year").value = data.year || "";

        // Tratamento das pastas e subpastas
        const folderSelect = document.getElementById("folder");
        const subFolderSelect = document.getElementById("subFolder");

          // Preencher o select do ano e definir o valor retornado pela API
          const yearSelect = document.getElementById("year");
          yearSelect.innerHTML = `<option value="${data.year}" selected>${data.year}</option>`;

        if (data.parentFolderId === null) {
            folderSelect.innerHTML = `<option value="${data.folderId}" selected>${data.folderName}</option>`;
            subFolderSelect.innerHTML = `<option value="">Nenhuma subpasta</option>`;
        } else {
            folderSelect.innerHTML = `<option value="${data.parentFolderId}" selected>${data.parentFolderName}</option>`;
            subFolderSelect.innerHTML = `<option value="${data.folderId}" selected>${data.folderName}</option>`;
        }

        // Exibir a imagem ou arquivo carregado (se necessário)
        const uploadedFilesDiv = document.getElementById("uploaded-files");
        uploadedFilesDiv.innerHTML = `
            <div class="uploaded-file">
                <a href="${data.filePath}" target="_blank">📄 ${data.name}</a>
            </div>
        `;

    } catch (error) {
        console.error("Erro ao carregar os dados:", error.message);
    }
});
