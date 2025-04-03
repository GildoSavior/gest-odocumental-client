document.addEventListener("DOMContentLoaded", function () {



  const passwordWrapper = document.querySelector(".password-wrapper");


  if (passwordWrapper) {

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (passwordWrapper.style.display === "none") {
          passwordWrapper.style.display = "flex"; // Ou outro valor adequado
        }
      });
    });

    observer.observe(passwordWrapper, { attributes: true, attributeFilter: ["style"] });
  }

  const abrirButton = document.querySelector(".button.blue");
  abrirButton.addEventListener("click", async function (event) {
    event.preventDefault();
    const folderId = localStorage.getItem("selectedFolderId");
    if (!folderId) {
      alert("Erro: Nenhum folder selecionado.");
      return;
    }

    const passwordInput = document.getElementById("password");
    const password = passwordInput.value.trim();
    if (!password) {
      alert("Por favor, digite a senha.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    // URL da API
    const apiUrl = `http://localhost:8080/api/folders/${folderId}/password/${password}`;

    try {
      // Faz requisição GET para a API
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // Converte resposta em JSON
      const result = await response.json();

      // Exibe a mensagem do backend
      if (result.data === true) {
        document.querySelector(".w-form-done").style.display = "block";
        document.querySelector(".w-form-done div").textContent = result.message;
        setTimeout(() => {
          window.location.href = `pastas/inside-folder.html?id=${folderId}`;
        }, 2000);
      } else {
        document.querySelector(".w-form-fail").style.display = "block";
        document.querySelector(".w-form-fail div").textContent = result.message;
        setTimeout(() => {
          window.location.href = "main-dashboard.html";
        }, 2000);
      }

    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      alert("Erro ao conectar com o servidor.");
    }

  })






});