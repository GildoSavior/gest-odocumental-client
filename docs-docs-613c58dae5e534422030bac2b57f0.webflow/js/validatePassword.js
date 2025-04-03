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

});