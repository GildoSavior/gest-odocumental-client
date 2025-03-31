document.addEventListener("DOMContentLoaded", async function () {
    const apiBaseUrl = "http://localhost:8080/api/users";
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get("userEmail");

    // Referências aos modais
    const modalSucesso = document.querySelector(".modal-sucesso");
    const modalErro = document.querySelector(".modal-erro");

    if (userEmail) {
        try {
            const response = await fetch(`${apiBaseUrl}/${userEmail}`);
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

        const token = localStorage.getItem("jwtToken");
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        try {
            let response;
            if (userEmail) {
                response = await fetch(`${apiBaseUrl}/${userEmail}`, {
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
                console.log("Usuário salvo:", result.data);
                modalSucesso.style.display = "block"; // Exibir modal de sucesso

                // Upload da imagem, se existir
                const fileInput = document.getElementById("image");
                if (fileInput.files.length > 0) {
                    const formData = new FormData();
                    formData.append("file", fileInput.files[0]);

                    const uploadResponse = await fetch(`${apiBaseUrl}/upload/${result.data.email}`, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` },
                        body: formData
                    });

                    if (!uploadResponse.ok) throw new Error("Erro no upload da imagem");
                    console.log("Imagem enviada com sucesso");

                    setTimeout(() => {
                        window.location.href = "../main-dashboard.html";
                    }, 1000);
                }

                // Ocultar modal após 3 segundos
                setTimeout(() => modalSucesso.style.display = "none", 3000);
            } else {
                alert("Erro ao salvar usuário:" + result.message);
                modalErro.style.display = "block"; // Exibir modal de erro
                setTimeout(() => modalErro.style.display = "none", 3000);
            }
        } catch (error) {
            alert("Erro:" + error);
            modalErro.style.display = "block";
            setTimeout(() => modalErro.style.display = "none", 3000);
        }
    });
});
