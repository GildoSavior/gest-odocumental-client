document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year"); // Primeiro select (anos)
    const folderSelect = document.getElementById("folder"); // Segundo select (pastas)
    const subFolderSelect = document.getElementById("subFolder"); // Terceiro select (subpastas)
    const authToken = localStorage.getItem("jwtToken"); // Obtém o token do localStorage (ou de outra fonte segura)

    if (!yearSelect || !folderSelect || !subFolderSelect || !authToken) return;

    const currentYear = new Date().getFullYear();
    const startYear = 2000;

    yearSelect.innerHTML = `<option value="">Selecione um ano</option>`;
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Evento para carregar as pastas ao selecionar um ano
    yearSelect.addEventListener("change", async () => {
        const selectedYear = yearSelect.value;
        if (!selectedYear) return;

        try {
            const response = await fetch(`http://localhost:8080/api/folders/year/${selectedYear}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao carregar pastas");

            const res = await response.json();
            const folders = res.data;

            folderSelect.innerHTML = `<option value="">Selecione uma pasta</option>`;
            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`; // Resetar subpastas

            folders.forEach(folder => {
                const option = document.createElement("option");
                option.value = folder.id || folder.name; // Usa `id` se disponível, senão `name`
                option.textContent = folder.name;
                folderSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Erro ao buscar pastas:", error);
        }
    });

    // Evento para carregar as subpastas ao selecionar uma pasta
    folderSelect.addEventListener("change", async () => {
        const selectedFolderId = folderSelect.value;
        
        if (!selectedFolderId) {
            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`; // Resetar subpastas
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/folders/${selectedFolderId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Erro ao carregar subpastas");

            const res = await response.json();            
            const subFolders = res.data.content;            

            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`;
            
            subFolders.forEach(subFolder => {
                const option = document.createElement("option");
                option.value = subFolder.id || subFolder.name;
                option.textContent = subFolder.name;
                subFolderSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Erro ao buscar subpastas:", error);
        }
    });
});
