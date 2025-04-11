

document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';
    const storedEmail = localStorage.getItem("userEmail");
    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => {
        loading.style.display = "block";
    }

    const closeLoading = () => {
        loading.style.display = "none";
    }

    if (!storedEmail) {
        alert("Erro: Nenhum email encontrado. Faça login novamente.");
        window.location.href = "index.html";
        return;
    }

    document.querySelector(".entrar").addEventListener("click", function (event) {
        event.preventDefault();

        isLoading();

        const code = document.getElementById("code").value;

        if (!code) {
            closeLoading();
            erro.style.display = "block";
            erro.querySelector(".paragraph-2").textContent = "Por favor, insira o código de confirmação";
            return;
        }

        const requestData = new URLSearchParams();
        requestData.append("email", storedEmail);
        requestData.append("code", code);

        fetch(`${BASE_URL}/auth/email/validateConfirmationCode`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: requestData
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    const authData = data.data; // Extrai os dados de AuthResponseDTO

                    // Armazena os dados no localStorage
                    localStorage.setItem("jwtToken", authData.jwt);
                    localStorage.setItem("userEmail", authData.email);
                    localStorage.setItem("userRole", authData.role);
                    localStorage.setItem("userPermissions", JSON.stringify(authData.userPermissions));
                    localStorage.setItem("isFirstLogin", authData.isFirstLogin);

                    closeLoading();
                    sucesso.style.display = "block";
                    sucesso.querySelector(".paragraph-2").textContent = "Código validado com sucesso! Redirecionando...";

                    setTimeout(() => {
                        window.location.href = "main-dashboard.html";
                    }, 500);
                } else {
                    closeLoading();
                    erro.style.display = "block";
                    erro.querySelector(".paragraph-2").textContent = "Erro ao validar código: " + data.message;                    
                }
            })
            .catch(error => {
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = "Erro ao enviar requisição:" + error;
            });
    });
});
