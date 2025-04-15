const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("position");
    const token = localStorage.getItem("jwtToken");

    fetch(`${BASE_URL}/users/positions`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar os cargos");
            }
            return response.json();
        })
        .then(data => {
            if (data.ok && Array.isArray(data.data)) {
                // Cria a opção padrão "Selecione o cargo"
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Selecione o cargo";
                defaultOption.selected = true;
                defaultOption.disabled = true;
                select.appendChild(defaultOption);

                data.data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.value;
                    option.textContent = item.label;
                    select.appendChild(option);
                });
            } else {
                alert("Erro: Dados inesperados.");
            }
        })
        .catch(error => {
            console.error("Erro ao buscar posições:", error);
            alert("Erro ao carregar cargos.");
        });
});