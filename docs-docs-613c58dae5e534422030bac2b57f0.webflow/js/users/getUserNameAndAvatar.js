document.addEventListener("DOMContentLoaded", async () => {
    const profileName = document.querySelector(".text-block-94"); 
    const profileImage = document.querySelector(".profile-2"); 

    const token = localStorage.getItem("jwtToken"); 

    if (!token) {
        console.error("Token de autenticação não encontrado!");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/users/gildosalva.pe@gmail.com", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: Falha ao carregar os dados do usuário.`);
        }

        const res = await response.json();
        const userData = res.data;

        if (userData.name) {
            profileName.textContent = userData.name; 
        }

        if (userData.imageUrl) {
            profileImage.style.backgroundImage = `url('${userData.imageUrl}')`; 
            profileImage.style.backgroundSize = "cover";  
            profileImage.style.backgroundPosition = "center";  
        }
    } catch (error) {
        console.error("Erro ao buscar os dados do usuário:", error);
    }
});
