document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year");
    const folderSelect = document.getElementById("folder");
    const subFolderSelect = document.getElementById("subFolder");
    const authToken = localStorage.getItem("jwtToken");

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
            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`;

            folders.forEach(folder => {
                const option = document.createElement("option");
                option.value = folder.id || folder.name;
                option.textContent = folder.name;
                folderSelect.appendChild(option);
            });

        } catch (error) {
            console.error("Erro ao buscar pastas:", error);
        }
    });

    folderSelect.addEventListener("change", async () => {
        const selectedFolderId = folderSelect.value;
        
        if (!selectedFolderId) {
            subFolderSelect.innerHTML = `<option value="">Selecione uma subpasta</option>`;
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

    // -------------------- Input de Arquivo --------------------

    const input = document.getElementById('image');
    const dropArea = document.getElementById('drop-area');
    const uploadedFilesContainer = document.getElementById('uploaded-files');

    if (!input || !dropArea || !uploadedFilesContainer) return;

    input.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });
    
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('highlight');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('highlight');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('highlight');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        uploadedFilesContainer.innerHTML = ''; // Limpa antes de adicionar novos arquivos
        
        Array.from(files).forEach(file => {
            const fileDiv = document.createElement('div');
            fileDiv.classList.add('uploaded-file-content');

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

    window.removeFile = function(button) {
        button.parentElement.remove();
    };
});
