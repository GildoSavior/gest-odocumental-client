document.addEventListener("DOMContentLoaded", function () {

    const folderName = localStorage.getItem("selectedFolderName") || "Pasta desconhecida";
    const folderYear = localStorage.getItem("selectedFolderYear") || "Ano desconhecido";
    const subFolderName = localStorage.getItem("selectedSubFolderName") || "Subpasta desconhecida";
    const breadcrumb = document.querySelector(".text-block-113");

    const dropdownList = document.querySelector(".dropdown-list-4");

    if (dropdownList) {
        dropdownList.innerHTML = ""; // Limpa os links existentes

        for (let year = 2025; year >= 2000; year--){
            const link = document.createElement("a");
            link.href = `pastas/main-pastas-do-ano.html?ano=${year}`; // Ajuste conforme sua estrutura de URLs
            link.className = "droplink-anos w-dropdown-link";
            link.textContent = year;

            // Se quiser marcar o ano atual como "ativo":
            if (year === new Date().getFullYear()) {
                link.classList.add("w--current");
                link.href = "main-dashboard.html"; // Ex: ano atual leva ao dashboard principal
            }

            dropdownList.appendChild(link);
        }
    }
    if (!breadcrumb) return;

    if (window.location.href.includes("inside-sub-folder")) {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName} > ${subFolderName}`;
    } else {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName}`;
    }

});
