// -------------------- Upload de Arquivos --------------------
const input = document.getElementById("image");
const dropArea = document.getElementById("drop-area");
const uploadedFilesContainer = document.getElementById("uploaded-files");

if (input && dropArea && uploadedFilesContainer) {
    input.addEventListener("change", (event) => handleFiles(event.target.files));
    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("highlight");
    });

    dropArea.addEventListener("dragleave", () => dropArea.classList.remove("highlight"));

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("highlight");
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    uploadedFilesContainer.innerHTML = "";
    Array.from(files).forEach(file => {
        const fileDiv = document.createElement("div");
        fileDiv.classList.add("uploaded-file-content");

        fileDiv.innerHTML = `
            <div class="uploaded-file-info">
                <span class="uploaded-file-name">${file.name}</span>
                <span class="uploaded-file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            <a href="#" class="button gray w-button" onclick="removeFile(this)">Apagar</a>
        `;
        uploadedFilesContainer.appendChild(fileDiv);
    });
}

window.removeFile = function (button) {
    button.parentElement.remove();
};

// -------------------- Envio do Formulário --------------------
const form = document.getElementById("wf-form-Criar-Anuncio");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const year = document.getElementById("year").value;
    const password = document.getElementById("password").value;
    const folderId = subFolderSelect.value || folderSelect.value;
    const folderName = subFolderSelect.value 
        ? subFolderSelect.selectedOptions[0].textContent
        : folderSelect.selectedOptions[0].textContent;

    if (!name || !year || !password || !folderId) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/files", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
            body: JSON.stringify({ name, year: parseInt(year), folderId: parseInt(folderId), password })
        });

        if (!response.ok) throw new Error("Erro ao criar documento");

        const responseData = await response.json();
        const fileId = responseData.data.id;
        const fileName = responseData.data.name;

        alert("Documento criado com sucesso!");

        const fileInput = document.getElementById("image");
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append("file", fileInput.files[0]);
            formData.append("fileId", fileId);
            formData.append("fileName", fileName);
            formData.append("folderName", folderName);

            const uploadResponse = await fetch("http://localhost:8080/api/files/upload", {
                method: "POST",
                headers: { "Authorization": `Bearer ${authToken}` },
                body: formData
            });

            if (!uploadResponse.ok) throw new Error("Erro ao fazer upload");

            alert("Documento e arquivo enviados com sucesso!");
        } else {
            alert("Documento criado, mas nenhum arquivo foi enviado.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Ocorreu um erro durante o processo.");
    }
});