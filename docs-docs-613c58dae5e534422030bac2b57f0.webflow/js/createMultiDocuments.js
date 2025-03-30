document.addEventListener("DOMContentLoaded", async () => {
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
            const response = await fetch(`http://localhost:8080/api/folders/year/${year}`, {
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
            alert("Erro ao carregar as pastas. " + error );
        }
    }

    async function fetchSubFolders(folderId, selectedSubFolderId = null) {
        try {
            const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
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


    populateYears();
})