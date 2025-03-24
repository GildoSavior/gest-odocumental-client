document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".entrar").addEventListener("click", function (event) {
        event.preventDefault(); // Impede o redirecionamento padrão do link

        // Capturar valores do formulário
        const email = document.getElementById("email").value;
        const password = document.querySelector("input[type='password']").value;

        if (!email || !password) {
            alert("Preencha o email e a senha!");
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
                alert("Código de confirmação enviado para seu email!");
                localStorage.setItem("userEmail", email);
                window.location.href = "2-step-auth.html"; // Apenas redireciona se for sucesso
            } else {
                alert("Erro: " + data.message); // Exibe a mensagem de erro da API
            }
        })
        .catch(error => {
            console.error("Erro ao enviar requisição:", error);
            alert("Falha na conexão com o servidor.");
        });
    });
});
