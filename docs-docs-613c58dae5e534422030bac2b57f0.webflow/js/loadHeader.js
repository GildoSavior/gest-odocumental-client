document.addEventListener("DOMContentLoaded", function () {
    const folderName = localStorage.getItem("selectedFolderName") || "Pasta desconhecida";
    const folderYear = localStorage.getItem("selectedFolderYear") || "Ano desconhecido";
    const subFolderName = localStorage.getItem("selectedSubFolderName") || "Subpasta desconhecida";
    const breadcrumb = document.querySelector(".text-block-113");
    const dropdownToggleText = document.querySelector(".dropdown-toggle div:nth-child(2)");
    const dropdownList = document.querySelector(".dropdown-list-4");

    if (dropdownList && dropdownToggleText) {
        dropdownList.innerHTML = ""; // Limpa os links existentes

        // Adiciona opção "Todos"
        const allLink = document.createElement("a");
        allLink.href = "#";
        allLink.className = "droplink-anos w-dropdown-link";
        allLink.textContent = "Todos";

        allLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("selectedFilterYear");
            dropdownToggleText.textContent = "Todos";
            location.reload();
        });

        dropdownList.appendChild(allLink);

        // Adiciona os anos de 2025 até 2000
        for (let year = 2025; year >= 2000; year--) {
            const link = document.createElement("a");
            link.href = "#";
            link.className = "droplink-anos w-dropdown-link";
            link.textContent = year;

            link.addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.setItem("selectedFilterYear", year);
                dropdownToggleText.textContent = year;
                location.reload();
            });

            dropdownList.appendChild(link);
        }

        // Mostrar ano salvo no botão ou "Todos"
        const savedYear = localStorage.getItem("selectedFilterYear");
        dropdownToggleText.textContent = savedYear || "Todos";
    }

    // Atualiza o breadcrumb
    if (!breadcrumb) return;

    if (window.location.href.includes("inside-sub-folder")) {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName} > ${subFolderName}`;
    } else {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName}`;
    }
});
