document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".columns-3.w-row");

    const token = localStorage.getItem("jwtToken");// Substitua pelo token real

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Erro ao carregar os dados.");
      }

      const users = result.data.content;

      container.innerHTML = ""; // limpa os cards existentes

      users.forEach(user => {
        const column = document.createElement("div");
        column.className = "new-column w-col w-col-3";

        column.innerHTML = `
          <a href="../user/user-log.html?id=${user.id}" class="c-funcionario w-inline-block">
            <div class="c-funcionario-foto" style="background-image: url('${user.imageUrl}'); background-size: cover; background-position: center;"></div>
            <div>
              <h1 class="c-funcionario_name">${user.name}</h1>
              <div class="text-block-102">${user.position}</div>
            </div>
          </a>
        `;

        container.appendChild(column);
      });

    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível carregar os usuários.");
    }
  });