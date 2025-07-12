// Inicializa animações ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  // Configuração do particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 120,
        density: {
          enable: true,
          value_area: 1000,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 0.7,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 400,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  });

  // Efeito de brilho dinâmico
  document.addEventListener("mousemove", function (e) {
    const glow = document.querySelector(".glow-effect");
    glow.style.left = e.pageX + "px";
    glow.style.top = e.pageY + "px";
  });
});

$(document).ready(function () {
  // Simulando dados do profissional
  const professionalData = {
    name: "Dr. João Silva",
    specialty: "Cardiologista",
  };

  // Preenche os campos com os dados do profissional
  $("#professional-name-display").text(professionalData.name);
  $("#professional-specialty-display").text(professionalData.specialty);
  $("#professional-name").val(professionalData.name);
  $("#professional-specialty").val(professionalData.specialty);

  // Seleciona automaticamente o painel correspondente à especialidade
  if (professionalData.specialty.toLowerCase().includes("cardio")) {
    $("#panel-select").val("cardiologia");
  }

  // Efeito de foco nos campos
  $(".form-control, .form-select")
    .focus(function () {
      $(this).parent().parent().addClass("focused");
      $(this).parent().find(".underline").addClass("active");
    })
    .blur(function () {
      if ($(this).val() === "") {
        $(this).parent().parent().removeClass("focused");
      }
      $(this).parent().find(".underline").removeClass("active");
    });

  // Verifica campos preenchidos ao carregar
  $(".form-control, .form-select").each(function () {
    if ($(this).val() !== "") {
      $(this).parent().parent().addClass("focused");
    }
  });

  $("#register-room-form").submit(function (e) {
    e.preventDefault();

    // Mostra o loader no botão
    const btn = $(this).find(".btn-auth");
    btn.addClass("loading");

    const roomData = {
      roomNumber: $("#room-number").val(),
      panel: $("#panel-select").val(),
      professional: $("#professional-name").val(),
      specialty: $("#professional-specialty").val(),
      panelText: $("#panel-select option:selected").text(),
    };

    // Mostra SweetAlert com barra de progresso
    Swal.fire({
      title: "Configurando sua sala...",
      html: `
                    <div class="text-left mb-3">Preparando ambiente para:<br>
                    <b>Sala ${roomData.roomNumber}</b> - ${roomData.panelText}<br>
                    Profissional: <b>${roomData.professional}</b> (${roomData.specialty})</div>
                    <div class="progress-container">
                        <div class="progress" style="height: 8px;">
                            <div id="progress-bar" class="progress-bar" 
                                 role="progressbar" style="width: 0%"></div>
                        </div>
                        <div class="progress-steps">
                            <span class="step active">Configurando</span>
                            <span class="step">Verificando</span>
                            <span class="step">Conectando</span>
                            <span class="step">Finalizando</span>
                        </div>
                    </div>
                    <div class="loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                `,
      showConfirmButton: false,
      allowOutsideClick: false,
      backdrop: `
                        rgba(0,0,0,0.5)
                        url("/images/nyan-cat.gif")
                        left top
                        no-repeat
                    `,
      didOpen: () => {
        const progressBar = document.getElementById("progress-bar");
        const steps = document.querySelectorAll(".progress-steps .step");
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress > 100) progress = 100;
          progressBar.style.width = `${progress}%`;

          // Atualiza os passos
          if (progress >= 25) steps[0].classList.add("completed");
          if (progress >= 50) steps[1].classList.add("active");
          if (progress >= 75) steps[1].classList.add("completed");
          if (progress >= 85) steps[2].classList.add("active");
          if (progress >= 95) steps[2].classList.add("completed");
          if (progress >= 98) steps[3].classList.add("active");

          if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
              Swal.close();
              btn.removeClass("loading");
              localStorage.setItem("roomData", JSON.stringify(roomData));
              // Efeito de transição antes de redirecionar
              gsap.to(".auth-card", {
                duration: 0.8,
                y: -50,
                opacity: 0,
                ease: "power2.in",
                onComplete: () => {
                  window.location.href = "atendimento.html";
                },
              });
            }, 500);
          }
        }, 300);
      },
    });
  });
});
