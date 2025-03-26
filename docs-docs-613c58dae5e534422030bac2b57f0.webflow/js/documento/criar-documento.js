document.addEventListener("DOMContentLoaded", () => {
    const yearSelect = document.getElementById("year"); // Primeiro select (anos)
    const folderSelect = document.getElementById("categoria-3"); // Segundo select (pastas)
    const authToken = localStorage.getItem("jwtToken"); // Obtém o token do localStorage (ou de outra fonte segura)

    if (!yearSelect || !folderSelect || !authToken) return;

    // Função para carregar os anos dinamicamente
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
                    "Authorization": `Bearer ${authToken}`, // Adiciona o token de autenticação
                    "Content-Type": "application/json"
                }
            });
            
            if (!response.ok) throw new Error("Erro ao carregar pastas");

            
            const res = await response.json();
            const folders = res.data;            

            // Limpa opções antigas e adiciona a opção "Todos"
            folderSelect.innerHTML = `<option value="">Selecione uma pasta</option>`;

            // Adiciona as novas opções com os valores retornados pela API
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
});
