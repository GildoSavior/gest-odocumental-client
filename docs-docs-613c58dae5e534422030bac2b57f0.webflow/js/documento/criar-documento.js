document.addEventListener("DOMContentLoaded", async () => {
    const yearSelect = document.getElementById("year");
    const folderSelect = document.getElementById("folder");
    const subFolderSelect = document.getElementById("subFolder");
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const uploadedFilesDiv = document.getElementById("uploaded-files");
    const authToken = localStorage.getItem("jwtToken");

    if (!yearSelect || !folderSelect || !subFolderSelect || !authToken) return;

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const fileId = getQueryParam("file");

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
            const response = await fetch(`http://localhost:8080/api/folders/year/${year}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json" }
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
            alert("Erro ao carregar as pastas. Tente novamente.");
        }
    }

    async function fetchSubFolders(folderId, selectedSubFolderId = null) {
        try {
            const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json" }
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
            alert("Erro ao carregar as subpastas. Tente novamente.");
        }
    }

    async function fetchDocument() {
        if (!fileId) {
            populateYears();
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/files/${fileId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao buscar os dados do documento.");

            const result = await response.json();
            if (!result.ok) throw new Error(result.message || "Erro na resposta da API.");

            const data = result.data;

            nameInput.value = data.name || "";
            passwordInput.value = data.password || "";

            populateYears(data.year);
            await fetchFolders(data.year, data.parentFolderId ?? data.folderId, data.parentFolderId ? data.folderId : null);

            if (data.filePath) {
                uploadedFilesDiv.innerHTML = `
                    <div class="uploaded-file">
                        <a href="${data.filePath}" target="_blank">📄 ${data.name}</a>
                    </div>
                `;
            }

        } catch (error) {
            console.error("Erro ao carregar os dados:", error.message);
        }
    }

    await fetchDocument();

    yearSelect.addEventListener("change", () => {
        if (yearSelect.value) fetchFolders(yearSelect.value);
    });

    folderSelect.addEventListener("change", () => {
        if (folderSelect.value) {
            fetchSubFolders(folderSelect.value);
        } else {
            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`;
        }
    });








    
});
