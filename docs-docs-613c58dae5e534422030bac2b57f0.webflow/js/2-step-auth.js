document.addEventListener("DOMContentLoaded", function () {
    const storedEmail = localStorage.getItem("userEmail");

    if (!storedEmail) {
        alert("Erro: Nenhum email encontrado. Faça login novamente.");
        window.location.href = "index.html";
        return;
    }

    document.querySelector(".entrar").addEventListener("click", function (event) {
        event.preventDefault();

        const code = document.getElementById("code").value;

        if (!code) {
            alert("Por favor, insira o código de confirmação.");
            return;
        }

        const requestData = new URLSearchParams();
        requestData.append("email", storedEmail);
        requestData.append("code", code);

        fetch("http://localhost:8080/api/auth/email/validateConfirmationCode", {
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

                    alert("Código validado com sucesso! Redirecionando...");

                    setTimeout(() => {
                        window.location.href = "main-dashboard.html";
                    }, 2000);
                } else {
                    alert("Erro ao validar código: " + data.message);
                    
                }
            })
            .catch(error => {
                console.error("Erro ao enviar requisição:", error);
                alert("Falha na conexão com o servidor.");
            });
    });
});
