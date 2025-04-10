import { BASE_URL } from '../config.js';

document.addEventListener("DOMContentLoaded", async function () {
    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    isLoading = () => {
        loading.style.display = "block";
    }

    closeLoading = () => {
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

        // Preencher automaticamente o select "Pasta Mãe" com os dados da API
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
                alert("Por favor, selecione uma Pasta Mãe.");
                return;
            }

            const data = {
                name: nome,
                year: parseInt(ano),
                password: senha,
                parentId: parentFolderId
            };

            // Fazer o POST para criar a sub-pasta
            const response = await fetch(`${BASE_URL}/api/folders`, {
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
                throw new Error("Erro ao criar sub-pasta");
            }

            const result = await response.json();
            closeLoading();
            sucesso.style.display = "block";

            setTimeout(() => {
                window.location.href = "../main-dashboard.html";
            }, 100);
        });

    } catch (error) {
        console.error("Erro:", error);
        alert(error.message);
    }
});
