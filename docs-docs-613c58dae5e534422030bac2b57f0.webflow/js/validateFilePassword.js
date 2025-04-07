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

    const fileId = localStorage.getItem("selectedFileId");
    const filePath = localStorage.getItem("selectedFilePath");

    if (!fileId) {
      alert("Erro: Nenhum folder selecionado.");
      return;
    }
    const urlAtual = window.location.href;
    var isMainFolder = urlAtual.includes("inside-folder.html")

    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    if (!password) {
      alert("Por favor, digite a senha.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    const apiUrl = `http://localhost:8080/api/files/${fileId}/password/${password}`;

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
        window.open(filePath, "_blank");
      } else {
        document.querySelector(".w-form-fail").style.display = "block";
        document.querySelector(".w-form-fail div").textContent = result.message;
        setTimeout(() => {
          window.location.href = isMainFolder ? "main-dashboard.html" : "../main-dashboard.html";
        }, 2000);
      }

    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      alert("Erro ao conectar com o servidor.");
    }
  })
});