document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Capturar valores do formulário
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Selecionar elementos de mensagem
        const successMessage = document.getElementById("success-message");
        const errorMessage = document.getElementById("error-message");

        // Função para exibir mensagem
        function showMessage(element, message) {
            element.innerText = message;
            element.style.display = "block";
            setTimeout(() => {
                element.style.display = "none"; // Esconde após 5 segundos
            }, 5000);
        }

        // Limpar mensagens anteriores
        successMessage.style.display = "none";
        errorMessage.style.display = "none";

        // Validar campos
        if (!email || !password) {
            showMessage(errorMessage, "Preencha o email e a senha!");
            return;
        }

        // Criar objeto JSON para envio
        const loginData = {
            email: email,
            password: password
        };

        // Enviar requisição para o backend
        fetch("http://localhost:8080/api/auth/validateCredentials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showMessage(successMessage, "Código de confirmação enviado para seu email!");

                // Redireciona após um pequeno atraso para permitir que a mensagem seja vista
                setTimeout(() => {
                    window.location.href = "2-step-auth.html";
                }, 2000);
            } else {
                showMessage(errorMessage, "Erro: " + data.message);
            }
        })
        .catch(error => {
            console.error("Erro ao enviar requisição:", error);
            showMessage(errorMessage, "Falha na conexão com o servidor.");
        });
    });
});
