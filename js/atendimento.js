$(document).ready(function () {
  // Inicializa AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
  });

  // Toggle sidebar com o botão flutuante
  $("#sidebarToggle").click(function () {
    $("#sidebar").toggleClass("show");
  });

  // Toggle sidebar melhorado
  $("#toggleSidebar").click(function (e) {
    e.stopPropagation();
    const sidebar = $("#sidebar");
    const isShowing = sidebar.hasClass("show");

    if (isShowing) {
      // Fechar sidebar
      anime({
        targets: "#sidebar",
        translateX: [0, -250],
        duration: 300,
        easing: "easeInOutQuad",
        complete: function () {
          sidebar.removeClass("show");
        },
      });
    } else {
      // Abrir sidebar
      sidebar.addClass("show");
      anime({
        targets: "#sidebar",
        translateX: [-250, 0],
        duration: 300,
        easing: "easeInOutQuad",
      });
    }
  });

  // Fechar sidebar ao clicar fora
  $(document).click(function (e) {
    if ($(window).width() <= 992) {
      if (
        !$(e.target).closest("#sidebar").length &&
        !$(e.target).is("#toggleSidebar")
      ) {
        if ($("#sidebar").hasClass("show")) {
          anime({
            targets: "#sidebar",
            translateX: [0, -250],
            duration: 300,
            easing: "easeInOutQuad",
            complete: function () {
              $("#sidebar").removeClass("show");
            },
          });
        }
      }
    }
  });

  // Efeito de onda nos botões
  $(".ripple").on("click", function (e) {
    var ripple = $('<span class="ripple-effect"></span>');
    var btnOffset = $(this).offset();
    var xPos = e.pageX - btnOffset.left;
    var yPos = e.pageY - btnOffset.top;

    ripple
      .css({
        top: yPos,
        left: xPos,
      })
      .appendTo($(this));

    window.setTimeout(function () {
      ripple.remove();
    }, 1000);
  });

  // Carrega dados da sala
  const roomData = JSON.parse(localStorage.getItem("roomData"));
  if (roomData) {
    $("#sala-info").text(
      `Sala ${roomData.roomNumber} - ${
        roomData.panel.charAt(0).toUpperCase() + roomData.panel.slice(1)
      }`
    );
  }

  // Fechar sidebar ao clicar em um item do menu (para telas pequenas)
  $(".sidebar-menu .nav-link").click(function () {
    if ($(window).width() <= 992) {
      anime({
        targets: "#sidebar",
        translateX: [0, -250],
        duration: 300,
        easing: "easeInOutQuad",
        complete: function () {
          $("#sidebar").removeClass("show");
        },
      });
    }
  });

  // Restante do seu código JavaScript permanece o mesmo...
  // (inclua todas as outras funções que você tinha antes)

  // Atualiza data atual
  const dataAtual = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  $("#data-atual").text(dataAtual.toLocaleDateString("pt-BR", options));

  // Modal de documentos avulsos
  $("#btn-emitir-documentos").click(function () {
    $("#modalDocumentos").modal("show");
  });

  // Trocar sala
  $("#trocar-sala").click(function () {
    anime({
      targets: ".main-content",
      translateX: [0, 100],
      opacity: [1, 0],
      easing: "easeInOutQuad",
      duration: 300,
      complete: function () {
        window.location.href = "index.html";
      },
    });
  });

  // Atualizar lista de pacientes
  $("#refresh-pacientes").click(function () {
    const refreshIcon = $(this);
    refreshIcon.html('<span class="spinner"></span> Atualizando...');

    // Animação de loading
    anime({
      targets: ".patient-card",
      translateY: [0, -10, 0],
      opacity: [1, 0.5, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: "easeInOutQuad",
    });

    // Simula requisição AJAX
    setTimeout(() => {
      refreshIcon.html('<i class="mdi mdi-check"></i> Atualizado');

      // Feedback visual
      anime({
        targets: refreshIcon[0],
        backgroundColor: ["#6c757d", "#28a745"],
        color: ["#fff", "#fff"],
        duration: 500,
        easing: "easeInOutQuad",
      });

      setTimeout(() => {
        refreshIcon.html('<i class="mdi mdi-refresh"></i> Atualizar');
        anime({
          targets: refreshIcon[0],
          backgroundColor: ["#28a745", "#6c757d"],
          color: ["#fff", "#fff"],
          duration: 500,
          easing: "easeInOutQuad",
        });
      }, 2000);
    }, 1500);
  });

  // Iniciar atendimento
  $(".iniciar-atendimento").click(function () {
    const paciente = $("#paciente-atual .patient-name").text();

    Swal.fire({
      title: "Iniciar Atendimento",
      html: `Deseja iniciar o atendimento de <b>${paciente}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, iniciar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#5e60d5",
      background: "rgba(255, 255, 255, 0.95)",
      backdrop: "rgba(0, 0, 0, 0.1)",
    }).then((result) => {
      if (result.isConfirmed) {
        anime({
          targets: "#paciente-atual",
          translateX: [0, -100],
          opacity: [1, 0],
          easing: "easeInOutQuad",
          duration: 300,
          complete: function () {
            window.location.href = "ficha.html";
          },
        });
      }
    });
  });

  // Buscar paciente para documento
  $("#btn-buscar-paciente").click(function () {
    const termo = $("#busca-paciente").val();
    if (termo.length < 3) {
      anime({
        targets: "#busca-paciente",
        translateX: [-10, 10, -10, 10, 0],
        duration: 400,
        easing: "easeInOutQuad",
      });

      Swal.fire({
        title: "Termo muito curto",
        text: "Digite pelo menos 3 caracteres para buscar",
        icon: "warning",
        background: "rgba(255, 255, 255, 0.95)",
        backdrop: "rgba(0, 0, 0, 0.1)",
      });
      return;
    }

    // Simula busca AJAX
    $(this).html('<span class="spinner"></span> Buscando...');

    anime({
      targets: "#busca-paciente",
      borderColor: ["#ced4da", "#5e60d5", "#ced4da"],
      duration: 1000,
      easing: "easeInOutQuad",
    });

    setTimeout(() => {
      $(this).html('<i class="mdi mdi-magnify"></i> Buscar');
      Swal.fire({
        title: "Paciente encontrado",
        text: "Dados do paciente carregados com sucesso",
        icon: "success",
        background: "rgba(255, 255, 255, 0.95)",
        backdrop: "rgba(0, 0, 0, 0.1)",
      });
    }, 1500);
  });

  // Imprimir documento
  $("#btn-imprimir-documento").click(function () {
    Swal.fire({
      title: "Documento enviado para impressão",
      text: "O documento foi gerado com sucesso e enviado para a impressora padrão.",
      icon: "success",
      confirmButtonColor: "#5e60d5",
      background: "rgba(255, 255, 255, 0.95)",
      backdrop: "rgba(0, 0, 0, 0.1)",
    }).then(() => {
      $("#modalDocumentos").modal("hide");
    });
  });

  // Ver todos os pacientes
  $("#ver-todos-pacientes").click(function () {
    $("#modalPacientesHoje").modal("show");
  });

  // Ver histórico completo
  $("#ver-historico-completo").click(function () {
    $("#modalAtendidos").modal("show");
  });

  // Controles de movimento na fila
  $(".move-up").click(function () {
    const card = $(this).closest(".patient-card");
    anime({
      targets: card[0],
      translateY: -20,
      opacity: 0,
      duration: 200,
      easing: "easeInQuad",
      complete: function () {
        card.insertBefore(card.prev());
        anime({
          targets: card[0],
          translateY: 0,
          opacity: 1,
          duration: 200,
          easing: "easeOutQuad",
        });
        atualizarBotoesMovimento();
      },
    });
  });

  $(".move-down").click(function () {
    const card = $(this).closest(".patient-card");
    anime({
      targets: card[0],
      translateY: 20,
      opacity: 0,
      duration: 200,
      easing: "easeInQuad",
      complete: function () {
        card.insertAfter(card.next());
        anime({
          targets: card[0],
          translateY: 0,
          opacity: 1,
          duration: 200,
          easing: "easeOutQuad",
        });
        atualizarBotoesMovimento();
      },
    });
  });

  // Função para atualizar os botões de movimento
  function atualizarBotoesMovimento() {
    $(".patient-card").each(function (index) {
      const moveUp = $(this).find(".move-up");
      const moveDown = $(this).find(".move-down");

      // Esconde todos primeiro
      moveUp.hide();
      moveDown.hide();

      // Mostra os apropriados
      if (index === 0) {
        // Primeiro item - só pode descer
        moveDown.show();
      } else if (index === $(".patient-card").length - 1) {
        // Último item - só pode subir
        moveUp.show();
      } else {
        // Itens do meio - podem subir e descer
        moveUp.show();
        moveDown.show();
      }
    });
  }

  // Inicializa os botões de movimento
  atualizarBotoesMovimento();
});

// Atualiza data e hora em tempo real
function atualizarDataHora() {
  const elementoData = document.getElementById("data-atual");
  const agora = new Date();

  // Formatação da data
  const opcoesData = {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const dataFormatada = agora.toLocaleDateString("pt-BR", opcoesData);

  // Formatação da hora
  const horas = agora.getHours().toString().padStart(2, "0");
  const minutos = agora.getMinutes().toString().padStart(2, "0");
  const segundos = agora.getSeconds().toString().padStart(2, "0");

  // Atualiza o elemento HTML
  elementoData.textContent = `${dataFormatada} ${horas}:${minutos}:${segundos}`;
}

// Atualiza imediatamente
atualizarDataHora();

// Atualiza a cada segundo (1000ms)
setInterval(atualizarDataHora, 1000);

// Animação de entrada para o conteúdo principal
anime({
  targets: ".main-content",
  opacity: [0, 1],
  translateY: [20, 0],
  duration: 800,
  easing: "easeOutQuad",
});
