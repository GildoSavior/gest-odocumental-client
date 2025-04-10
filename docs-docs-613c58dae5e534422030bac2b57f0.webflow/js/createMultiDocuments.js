document.addEventListener("DOMContentLoaded", async () => {

    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';
    
    const yearSelect = document.getElementById("year");
    const folderSelect = document.getElementById("folder");
    const subFolderSelect = document.getElementById("subFolder");
    const authToken = localStorage.getItem("jwtToken");



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

            if (!response.ok) throw new Error("Erro ao carregar pastas: ");

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
            alert("Erro ao carregar as pastas. " + error);
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
            alert("Erro ao carregar subpastas. " + error);
        }
    }

    yearSelect.addEventListener("change", async () => {
        const year = yearSelect.value;
        if (year) await fetchFolders(year);
    });

    folderSelect.addEventListener("change", async () => {
        const folderId = folderSelect.value;
        if (folderId) await fetchSubFolders(folderId);
    });


    const form = document.getElementById("wf-form-Criar-Anuncio");
    const fileInput = document.getElementById("image");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita o reload da página

        const year = yearSelect.value;
        const folderId = subFolderSelect.value || folderSelect.value;
        const files = fileInput.files;

        if (!year || !folderId || files.length === 0) {
            alert("Por favor, selecione uma pasta, um ano e adicione arquivos.");
            return;
        }

        const formData = new FormData();
        for (let file of files) {
            formData.append("files", file);
        }

        try {
            const response = await fetch(`${BASE_URL}/files/${folderId}/${year}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert("Arquivos enviados com sucesso!");

                fileInput.value = ""; // Limpa o input

                setTimeout(() => {
                    window.location.href = "../main-dashboard.html";
                }, 1000);
            } else {

                throw new Error(result.message || "Erro ao enviar arquivos.");
            }
        } catch (error) {
            console.error("Erro ao enviar os arquivos:", error);
            alert("Erro ao enviar os arquivos. Verifique a conexão com o servidor.");
        }
    });

    populateYears();



})