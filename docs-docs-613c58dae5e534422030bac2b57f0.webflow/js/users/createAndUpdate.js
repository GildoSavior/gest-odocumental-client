document.addEventListener("DOMContentLoaded", async function () {

    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

    const apiBaseUrl = `${BASE_URL}/users`;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    const token = localStorage.getItem("jwtToken");


    const certeza = document.querySelector(".certeza");
    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => {
        loading.style.display = "block";
    }

    const closeLoading = () => {
        loading.style.display = "none";
    }

    // Referências aos modais
    const modalSucesso = document.querySelector(".modal-sucesso");
    const modalErro = document.querySelector(".modal-erro");

    if (userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/id/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Passando o token no cabeçalho
                }
            });

            if (response.ok) {
                const result = await response.json();
                const userData = result.data; // Pegando os dados corretos

                document.getElementById("name").value = userData.name;
                document.getElementById("position").value = userData.position;
                document.getElementById("email").value = userData.email;
                document.getElementById("telefone").value = userData.phoneNumber;

                // Preenchendo permissões
                Object.entries(userData.permissions).forEach(([key, value]) => {
                    const input = document.querySelector(`input[value="${key}"]`);
                    if (input) input.checked = value;
                });
            }
        } catch (error) {
            console.error("Erro ao carregar usuário:", error);
        }
    }

    document.querySelector(".button-2.blue").addEventListener("click", async function (event) {
        event.preventDefault();
        isLoading();



        const user = {
            id: null,
            name: document.getElementById("name").value,
            position: document.getElementById("position").value,
            role: "USER",
            email: document.getElementById("email").value, // Corrigido de "email" para "email2"
            phoneNumber: document.getElementById("telefone").value,
            enabled: true,
            isFirstLogin: true,
            permissions: {
                allPermissions: document.getElementById("allPermissions").checked,
                editOwnProfile: document.getElementById("editOwnProfile").checked,
                manageUsers: document.getElementById("manageUsers").checked,
                createDocuments: document.getElementById("createDocuments").checked,
                editAndDeleteDocuments: document.getElementById("editAndDeleteDocuments").checked,
                shareDocumentsInternally: document.getElementById("shareDocumentsInternally").checked,
                shareDocumentsExternally: document.getElementById("shareDocumentsExternally").checked,
                protectDocumentsAndFolders: document.getElementById("protectDocumentsAndFolders").checked,
                viewLogs: document.getElementById("viewLogs").checked
            }
        };


        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            let response;
            if (userId) {
                response = await fetch(`${apiBaseUrl}/${user.email}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(user)
                });
            } else {
                response = await fetch(apiBaseUrl, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(user)
                });
            }

            const result = await response.json(); // Pegando o JSON da resposta

            if (response.ok && result.ok) {
                const fileInput = document.getElementById("image");
                if (fileInput.files.length > 0) {
                    const formData = new FormData();
                    formData.append("file", fileInput.files[0]);

                    const uploadResponse = await fetch(`${apiBaseUrl}/upload/${result.data.email}`, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` },
                        body: formData
                    });

                    if (!uploadResponse.ok) {
                        closeLoading();
                        erro.style.display = "block";
                        erro.querySelector(".paragraph-2").textContent = "Erro ao criar utilizador: Não foi possível enviar a imagem.";
                        return;
                    }

                    closeLoading();
                    sucesso.style.display = "block";
                    sucesso.querySelector(".paragraph-2").textContent = "Utilizador criado com sucesso!";

                    setTimeout(() => {
                        window.location.href = "../main-dashboard.html";
                    }, 1000);
                }

                // Ocultar modal após 3 segundos
                setTimeout(() => modalSucesso.style.display = "none", 3000);
            } else {
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = "Erro ao salvar usuário:" + result.message;
                return;
            }
        } catch (error) {
            closeLoading();
            erro.style.display = "block";
            erro.querySelector(".paragraph-2").textContent = "Erro ao salvar usuário:" + result.message;
        }
    });
});
