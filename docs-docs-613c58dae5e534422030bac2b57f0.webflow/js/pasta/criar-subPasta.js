

document.addEventListener("DOMContentLoaded", async function () {

    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => {
        loading.style.display = "block";
    }

    const closeLoading = () => {
        loading.style.display = "none";
    }
    const authToken = localStorage.getItem("jwtToken");

    try {
        // Preencher automaticamente o select de anos (2000 - 2025)
        const selectAno = document.getElementById("ano-select");
        selectAno.innerHTML = "";
        for (let ano = 2000; ano <= 2025; ano++) {
            const option = document.createElement("option");
            option.value = ano;
            option.textContent = ano;
            selectAno.appendChild(option);
        }
        
        const selectPastaMae = document.getElementById("pasta-mae-select");

        const responseFolders = await fetch(`${BASE_URL}/folders`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${authToken}` }
        });

        if (!responseFolders.ok) throw new Error("Erro ao carregar pastas");

        const res = await responseFolders.json();
        const folders = res.data.content;

        selectPastaMae.innerHTML = `<option value="">Selecione uma pasta</option>`;
        folders.forEach(folder => {
            const option = document.createElement("option");
            option.value = folder.id;
            option.textContent = folder.name;
            selectPastaMae.appendChild(option);
        });

        // Capturar o clique no botão Criar Sub-Pasta
        document.querySelector(".button.blue").addEventListener("click", async function (event) {
            event.preventDefault();

            isLoading();
            // Capturar os valores do formulário
            const nome = document.getElementById("nome-do-an-ncio").value;
            const senha = document.getElementById("link-do-anuncio-2").value;
            const ano = selectAno.value;
            const parentFolderId = selectPastaMae.value;

            if (!parentFolderId) {
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = "Por favor, selecione uma Pasta Mãe";                
                return;
            }

            const data = {
                name: nome,
                year: parseInt(ano),
                password: senha,
                parentId: parentFolderId
            };

            // Fazer o POST para criar a sub-pasta
            const response = await fetch(`${BASE_URL}/folders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                closeLoading();
                erro.style.display = "block";                
                erro.querySelector(".paragraph-2").textContent = "Erro ao criar sub-pasta";
                return;                
            }

            const result = await response.json();
            closeLoading();
            sucesso.style.display = "block";
            setTimeout(() => {
                window.location.href = "../main-dashboard.html";
            }, 500);
        });

    } catch (error) {
        closeLoading();
        erro.style.display = "block";                
        erro.querySelector(".paragraph-2").textContent = error.message;
        alert(error.message);
    }
});
