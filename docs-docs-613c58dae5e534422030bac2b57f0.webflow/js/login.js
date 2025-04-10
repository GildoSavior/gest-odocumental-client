document.addEventListener("DOMContentLoaded", function () {

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

    document.querySelector(".entrar").addEventListener("click", function (event) {
        event.preventDefault(); // Impede o redirecionamento padrão do link
        isLoading();

        // Capturar valores do formulário
        const email = document.getElementById("email").value;
        const password = document.querySelector("input[type='password']").value;

        if (!email || !password) {
            closeLoading();
            erro.style.display = "block";
            erro.querySelector(".paragraph-2").textContent = "Preencha o email e a senha!";
            return;
        }

        // Criar objeto JSON para envio
        const loginData = {
            email: email,
            password: password
        };

        // Enviar requisição para o backend
        fetch(`${BASE_URL}/auth/validateCredentials`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    closeLoading();
                    sucesso.style.display = "block";
                    sucesso.querySelector(".paragraph-2").textContent = "Código de confirmação enviado para seu email!";
                    localStorage.setItem("userEmail", email);

                    setTimeout(() => {
                        window.location.href = "2-step-auth.html";
                    }, 500);

                } else {
                    closeLoading();
                    erro.style.display = "block";
                    erro.querySelector(".paragraph-2").textContent = data.message;
                }
            })
            .catch(error => {
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = error.message || "Falha na conexão com o servidor.";
            });
    });
});
