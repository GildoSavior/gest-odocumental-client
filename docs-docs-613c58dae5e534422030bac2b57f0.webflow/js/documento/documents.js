document.addEventListener("DOMContentLoaded", async () => {

    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';
    
    const yearSelect = document.getElementById("year");
    const folderSelect = document.getElementById("folder");
    const subFolderSelect = document.getElementById("subFolder");
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const authToken = localStorage.getItem("jwtToken");
    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");


    isLoading = () => {
        loading.style.display = "block";
    }

    closeLoading = () => {
        loading.style.display = "none";
    }



    if (!yearSelect || !folderSelect || !subFolderSelect || !authToken) return;

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    let fileId = getQueryParam("file");

    function populateYears(selectedYear = null) {
        const currentYear = new Date().getFullYear();
        const startYear = 2000;
        yearSelect.innerHTML = `<option value="">Selecione um ano</option>`;
        for (let year = currentYear; year >= startYear; year--) {
            yearSelect.innerHTML += `<option value="${year}" ${year == selectedYear ? "selected" : ""}>${year}</option>`;
        }
    }

    async function fetchFolders(year, selectedFolderId = null, selectedSubFolderId = null) {
        try {
            const response = await fetch(`${BASE_URL}/folders/year/${year}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) throw new Error("Erro ao carregar pastas");

            const res = await response.json();
            const folders = res.data;

            folderSelect.innerHTML = `<option value="">Selecione uma pasta</option>`;
            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`;

            folders.forEach(folder => {
                folderSelect.innerHTML += `<option value="${folder.id}" ${folder.id == selectedFolderId ? "selected" : ""}>${folder.name}</option>`;
            });

            if (selectedFolderId) {
                await fetchSubFolders(selectedFolderId, selectedSubFolderId);
            }
        } catch (error) {
            console.error("Erro ao buscar pastas:", error);
            alert("Erro ao carregar as pastas.");
        }
    }

    async function fetchSubFolders(folderId, selectedSubFolderId = null) {
        try {
            const response = await fetch(`${BASE_URL}/folders/${folderId}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) throw new Error("Erro ao carregar subpastas");

            const res = await response.json();
            const subFolders = res.data.content;

            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`;

            subFolders.forEach(subFolder => {
                subFolderSelect.innerHTML += `<option value="${subFolder.id}" ${subFolder.id == selectedSubFolderId ? "selected" : ""}>${subFolder.name}</option>`;
            });
        } catch (error) {
            console.error("Erro ao buscar subpastas:", error);
            alert("Erro ao carregar subpastas.");
        }
    }

    if (fileId) {
        try {
            const response = await fetch(`${BASE_URL}/files/${fileId}`, {
                headers: { "Authorization": `Bearer ${authToken}` }
            });

            if (!response.ok) throw new Error("Erro ao buscar o arquivo");

            const res = await response.json();
            const fileData = res.data;

            nameInput.value = fileData.name;
            passwordInput.value = fileData.password;

            populateYears(fileData.year);
            await fetchFolders(fileData.year, fileData.folderParentId, fileData.folderId);
        } catch (error) {
            console.error("Erro ao carregar dados do arquivo:", error);
            alert("Erro ao carregar dados do arquivo.");
        }
    } else {
        populateYears();
    }

    // Atualiza pastas quando o ano muda
    yearSelect.addEventListener("change", async () => {
        const year = yearSelect.value;
        if (year) await fetchFolders(year);
    });

    // Atualiza subpastas quando a pasta muda
    folderSelect.addEventListener("change", async () => {
        const folderId = folderSelect.value;
        if (folderId) await fetchSubFolders(folderId);
    });

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

        isLoading();

        const name = nameInput.value;
        const year = yearSelect.value;
        const password = passwordInput.value;
        const folderId = subFolderSelect.value || folderSelect.value;

        if (!name || !year || !folderId) {
            alert("Por favor, preencha todos os campos necessários.");
            return;
        }

        const payload = {
            name,
            year: parseInt(year),
            folderId: parseInt(folderId),
            password
        };

        const url = fileId
            ? `${BASE_URL}/files/update/${fileId}`
            : `${BASE_URL}/files`;

        const method = fileId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                closeLoading();
                erro.style.display = "block";
                throw new Error("Erro ao salvar o arquivo");
            }



            const responseData = await response.json();
            const fileName = responseData.data.name;
            const folderName = subFolderSelect.value
                ? subFolderSelect.selectedOptions[0].textContent
                : folderSelect.selectedOptions[0].textContent;

            if (!fileId) {
                fileId = parseInt(responseData.data.id);
            }

            const fileInput = document.getElementById("image");
            if (fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append("file", fileInput.files[0]);
                formData.append("fileId", fileId);
                formData.append("fileName", fileName);
                formData.append("folderName", folderName);

                const uploadResponse = await fetch(`${BASE_URL}/files/upload`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${authToken}` },
                    body: formData
                });

                if (!uploadResponse.ok) {
                    closeLoading();
                    erro.style.display = "block";
                    throw new Error("Erro ao fazer upload");
                }

                closeLoading();
                sucesso.style.display = "block";
                // alert("Documento e arquivo enviados com sucesso!");
               
            } else {
                //alert("Documento criado, mas nenhum arquivo foi enviado.");
            }

            setTimeout(() => {
                window.location.href = "../main-dashboard.html";
            }, 100);

        } catch (error) {
            console.error("Erro ao enviar:", error);
            alert("Falha ao salvar o arquivo.");
        }
    });
});
