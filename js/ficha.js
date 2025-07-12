$(document).ready(function () {
  // Configuração inicial
  const now = new Date();
  $("#hora-inicio").text(now.toLocaleString("pt-BR"));

  // Configuração de permissões por especialidade
  const userSpecialty = "Pediatria"; // Pode ser obtido do sistema ou do perfil do usuário
  const examPermissions = {
    "Clínico Geral": [
      "laboratoriais",
      "radiodiagnostico",
      "ultrassonografia",
      "tomografias",
      "ressonancias",
      "avulsa",
    ],
    Pediatria: [
      "laboratoriais",
      "radiodiagnostico",
      "ultrassonografia",
      "avulsa",
    ],
    Ortopedia: [
      "laboratoriais",
      "radiodiagnostico",
      "tomografias",
      "ressonancias",
      "avulsa",
    ],
    Cardiologia: ["laboratoriais", "ultrassonografia", "avulsa"],
    Neurologia: ["laboratoriais", "tomografias", "ressonancias", "avulsa"],
    Psicologia: ["sessoes", "avulsa"],
    Fisioterapia: ["sessoes", "avulsa"],
    Dermatologia: ["laboratoriais", "avulsa"],
  };

  // Tipos de exames disponíveis
  const examTypes = [
    { id: "laboratoriais", name: "Laboratoriais", icon: "mdi-test-tube" },
    {
      id: "radiodiagnostico",
      name: "Radiodiagnóstico",
      icon: "mdi-radiology-box",
    },
    {
      id: "ultrassonografia",
      name: "Ultrassonografia",
      icon: "mdi-ultrasound",
    },
    { id: "tomografias", name: "Tomografias", icon: "mdi-scanner" },
    { id: "ressonancias", name: "Ressonâncias", icon: "mdi-magnet" },
    { id: "sessoes", name: "Sessões/Terapias", icon: "mdi-account-group" },
    { id: "avulsa", name: "Solicitação Avulsa", icon: "mdi-plus-circle" },
  ];

  // Inicializar abas de exames com base nas permissões
  function initExamTabs() {
    const $tabsContainer = $("#exams-tabs");
    $tabsContainer.empty();

    // Obter permissões para a especialidade atual
    const allowedExams =
      examPermissions[userSpecialty] || examPermissions["Clínico Geral"];

    // Criar abas apenas para os exames permitidos
    examTypes.forEach((type) => {
      if (allowedExams.includes(type.id)) {
        const tab = $(`
                            <button class="exam-tab" data-target="${type.id}-section">
                                <i class="mdi ${type.icon} me-1"></i> ${type.name}
                            </button>
                        `);
        $tabsContainer.append(tab);
      }
    });

    // Ativar a primeira aba permitida
    if (allowedExams.length > 0) {
      $(`.exam-tab[data-target="${allowedExams[0]}-section"]`).addClass(
        "active"
      );
      $(`#${allowedExams[0]}-section`).addClass("active");
    }

    // Adicionar animação às abas
    anime({
      targets: ".exam-tab",
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 600,
      delay: anime.stagger(100),
      easing: "easeOutExpo",
    });
  }

  // Inicializar abas de exames
  initExamTabs();

  // Alternar entre seções de exames
  $(document).on("click", ".exam-tab", function () {
    const target = $(this).data("target");

    // Animação de saída da seção atual
    anime({
      targets: ".exam-section.active",
      opacity: 0,
      translateY: 10,
      duration: 200,
      easing: "easeInOutQuad",
      complete: function () {
        $(".exam-section").removeClass("active");
        $(".exam-tab").removeClass("active");

        // Ativar nova aba e seção
        $(this).addClass("active");
        $(`#${target}`).addClass("active");

        // Animação de entrada da nova seção
        anime({
          targets: `#${target}`,
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 300,
          easing: "easeOutQuad",
        });
      }.bind(this),
    });

    // Animação da aba ativa
    anime({
      targets: this,
      backgroundColor: ["rgba(67, 97, 238, 0.1)", "#4361ee"],
      color: ["#4361ee", "#ffffff"],
      duration: 300,
      easing: "easeInOutQuad",
    });

    // Animação das abas inativas
    $(".exam-tab")
      .not(this)
      .each(function () {
        anime({
          targets: this,
          backgroundColor: ["#4361ee", "rgba(67, 97, 238, 0.1)"],
          color: ["#ffffff", "#4361ee"],
          duration: 300,
          easing: "easeInOutQuad",
        });
      });
  });

  // Adicionar exame dinamicamente
  $(document).on("click", "[data-section]", function () {
    const section = $(this).data("section");
    const placeholderText = {
      laboratoriais: "Nome do exame laboratorial",
      radiodiagnostico: "Nome do exame de radiodiagnóstico",
      ultrassonografia: "Nome do exame de ultrassonografia",
      tomografias: "Nome do exame de tomografia",
      ressonancias: "Nome do exame de ressonância",
      sessoes: "Nome da sessão/terapia",
      avulsa: "Digite o nome do exame que deseja solicitar",
    };

    const newItem = $(`
                    <div class="d-flex mb-2">
                        <input type="text" class="form-control me-2" placeholder="${placeholderText[section]}" name="exame-${section}[]">
                        <button class="btn btn-sm btn-danger btn-remove-exame">
                            <i class="mdi mdi-delete"></i>
                        </button>
                    </div>
                `);

    // Animação ao adicionar novo item
    anime({
      targets: newItem[0],
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      easing: "easeOutExpo",
    });

    $(`#${section}-container`).append(newItem);
    $(`#${section}-container`).scrollTop(
      $(`#${section}-container`)[0].scrollHeight
    );
  });

  // Toggle sidebar
  $("#toggleSidebar").click(function () {
    $("#sidebar").toggleClass("show");
    anime({
      targets: "#sidebar",
      translateX: $("#sidebar").hasClass("show") ? [-250, 0] : [0, -250],
      duration: 300,
      easing: "easeInOutQuad",
    });
  });

  // Fechar sidebar ao clicar em um item (em telas pequenas)
  $(".sidebar-menu .nav-link").click(function () {
    if ($(window).width() < 992) {
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

  // Controle do tipo de prescrição
  $("#tipo-prescricao").change(function () {
    if ($(this).val() === "controle" || $(this).val() === "especial") {
      $(".prescription-item #campos-adicionais").show();
    } else {
      $(".prescription-item #campos-adicionais").hide();
    }
  });

  // Upload de arquivos
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("fileElem");
  const browseBtn = document.getElementById("browse-btn");
  const filesContainer = document.getElementById("files-container");
  const emptyMessage = document.getElementById("empty-message");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.classList.add("dragover");
    anime({
      targets: "#upload-icon",
      scale: [1, 1.1],
      duration: 200,
      easing: "easeInOutQuad",
    });
  }

  function unhighlight() {
    dropArea.classList.remove("dragover");
    anime({
      targets: "#upload-icon",
      scale: [1.1, 1],
      duration: 200,
      easing: "easeInOutQuad",
    });
  }

  dropArea.addEventListener("drop", handleDrop, false);
  browseBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  function handleFiles(files) {
    if (files.length > 0) {
      emptyMessage.style.display = "none";
      filesContainer.style.display = "block";

      for (let i = 0; i < files.length; i++) {
        addFileToContainer(files[i]);
      }
    }
  }

  function addFileToContainer(file) {
    const fileItem = document.createElement("div");
    fileItem.className = "file-item";

    const filePreview = document.createElement("div");
    filePreview.className = "d-flex flex-column align-items-center";

    const icon = document.createElement("i");
    icon.className = "mdi mdi-file-outline mdi-36px text-primary mb-1";

    const fileName = document.createElement("span");
    fileName.className = "text-truncate";
    fileName.style.maxWidth = "100px";
    fileName.textContent = file.name;

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger btn-sm btn-remove-file";
    removeBtn.innerHTML = '<i class="mdi mdi-close"></i>';
    removeBtn.addEventListener("click", function () {
      anime({
        targets: fileItem,
        opacity: [1, 0],
        height: [fileItem.offsetHeight, 0],
        marginBottom: [10, 0],
        paddingTop: [10, 0],
        paddingBottom: [10, 0],
        duration: 300,
        easing: "easeInOutQuad",
        complete: function () {
          fileItem.remove();
          if (filesContainer.children.length === 0) {
            emptyMessage.style.display = "block";
            filesContainer.style.display = "none";
          }
        },
      });
    });

    filePreview.appendChild(icon);
    filePreview.appendChild(fileName);
    fileItem.appendChild(filePreview);
    fileItem.appendChild(removeBtn);
    filesContainer.appendChild(fileItem);

    // Animação ao adicionar arquivo
    anime({
      targets: fileItem,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      easing: "easeOutExpo",
    });
  }

  // Adicionar prescrição
  $("#add-prescricao").click(function () {
    const tipoPrescricao = $("#tipo-prescricao").val();
    const newItem = $(`
                    <div class="prescription-item p-3 mb-3 glass-card">
                        <div class="row">
                            <div class="col-md-5 mb-2">
                                <input type="text" class="form-control" placeholder="Medicamento" name="medicamento[]">
                            </div>
                            <div class="col-md-4 mb-2">
                                <input type="text" class="form-control" placeholder="Posologia" name="posologia[]">
                            </div>
                            <div class="col-md-2 mb-2">
                                <input type="text" class="form-control" placeholder="Via" name="via[]">
                            </div>
                            <div class="col-md-1 mb-2 d-flex align-items-center">
                                <button class="btn btn-sm btn-danger w-100 btn-remove-prescricao">
                                    <i class="mdi mdi-delete"></i>
                                </button>
                            </div>
                        </div>
                        ${
                          tipoPrescricao === "controle" ||
                          tipoPrescricao === "especial"
                            ? `<div class="row mt-2" id="campos-adicionais">
                            <div class="col-md-6 mb-2">
                                <input type="text" class="form-control" placeholder="Quantidade" name="quantidade[]">
                            </div>
                            <div class="col-md-6 mb-2">
                                <input type="text" class="form-control" placeholder="CID" name="cid[]">
                            </div>
                        </div>`
                            : ""
                        }
                    </div>
                `);

    $("#prescricoes-container").append(newItem);
    $("#prescricoes-container").scrollTop(
      $("#prescricoes-container")[0].scrollHeight
    );

    // Animação ao adicionar prescrição
    anime({
      targets: newItem[0],
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      easing: "easeOutExpo",
    });
  });

  // Remover prescrição
  $(document).on("click", ".btn-remove-prescricao", function () {
    const item = $(this).closest(".prescription-item");
    anime({
      targets: item[0],
      opacity: [1, 0],
      height: [item.outerHeight(), 0],
      marginBottom: [15, 0],
      paddingTop: [15, 0],
      paddingBottom: [15, 0],
      duration: 300,
      easing: "easeInOutQuad",
      complete: function () {
        item.remove();
      },
    });
  });

  // Remover exame
  $(document).on("click", ".btn-remove-exame", function () {
    const item = $(this).closest(".d-flex");
    anime({
      targets: item[0],
      opacity: [1, 0],
      height: [item.outerHeight(), 0],
      marginBottom: [10, 0],
      duration: 300,
      easing: "easeInOutQuad",
      complete: function () {
        item.remove();
      },
    });
  });

  // Filtro por unidade no histórico
  $(".dropdown-unit .dropdown-item").click(function (e) {
    e.preventDefault();
    const unit = $(this).data("unit");
    $(".dropdown-unit .btn").html(
      `<i class="mdi mdi-hospital-building me-2"></i> ${unit}`
    );

    // Aqui você implementaria a filtragem real dos itens por unidade
    // Por enquanto, apenas simulamos destacando os itens da unidade selecionada
    $(".badge-unit").parent().parent().show();
    if (unit !== "Todas as unidades") {
      $(".badge-unit").each(function () {
        if ($(this).text() !== unit) {
          $(this).parent().parent().hide();
        }
      });
    }
  });

  // Finalizar atendimento
  $("#finalizar-atendimento").click(async function () {
    // 1. Validação dos campos obrigatórios
    const camposObrigatorios = validarCamposObrigatorios();
    if (!camposObrigatorios.validos) {
      await Swal.fire({
        title: "Campos obrigatórios",
        html: camposObrigatorios.mensagem,
        icon: "warning",
        confirmButtonColor: "#4361ee",
      });
      return;
    }

    // 2. Coletar todos os dados do formulário
    const formData = coletarDadosFormulario();

    // 3. Exibir dados no console para debug
    console.log("Dados coletados para envio:", formData);

    // 4. Confirmar com o usuário antes de enviar
    const confirmacao = await Swal.fire({
      title: "Finalizar Atendimento",
      html: "Tem certeza que deseja finalizar o atendimento?<br><small>Todos os dados serão salvos.</small>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, finalizar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4361ee",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          // Simular salvamento inicial (na prática, seria seu AJAX)
          setTimeout(resolve, 500);
        });
      },
    });

    if (!confirmacao.isConfirmed) {
      console.log("Finalização cancelada pelo usuário");
      return;
    }

    // 5. Processar envio dos dados (simulação)
    try {
      const resultadoEnvio = await enviarDadosAtendimento(formData);

      // 6. Feedback e redirecionamento
      await Swal.fire({
        title: "Atendimento Finalizado!",
        html: `O atendimento foi concluído com sucesso.<br><small>Redirecionando...</small>`,
        icon: "success",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      window.location.href = "atendimento.html";
    } catch (error) {
      console.error("Erro ao finalizar atendimento:", error);
      await Swal.fire({
        title: "Erro ao Finalizar",
        text: "Ocorreu um erro ao tentar finalizar o atendimento. Por favor, tente novamente.",
        icon: "error",
        confirmButtonColor: "#4361ee",
      });
    }
  });

  // Funções auxiliares
  function validarCamposObrigatorios() {
    const anamnese = $("#txt-anamnese").val().trim();
    const resumo = $("#txt-resumo").val().trim();

    const erros = [];

    if (anamnese.length < 200) {
      erros.push("A anamnese deve conter pelo menos 200 caracteres");
    }

    if (resumo.length === 0) {
      erros.push("O resumo do atendimento é obrigatório");
    }

    return {
      validos: erros.length === 0,
      mensagem: erros.join("<br>"),
    };
  }

  function coletarDadosFormulario() {
    // Dados básicos
    const formData = {
      anamnese: $("#txt-anamnese").val().trim(),
      resumo: $("#txt-resumo").val().trim(),
      prescricao: {
        tipo: $("#tipo-prescricao").val(),
        medicamentos: coletarMedicamentos(),
      },
      exames: {
        indicacao: $("#txt-indicacao").val().trim(),
        laboratoriais: coletarExames("laboratoriais"),
        radiodiagnostico: coletarExames("radiodiagnostico"),
        ultrassonografia: coletarExames("ultrassonografia"),
        tomografias: coletarExames("tomografias"),
        ressonancias: coletarExames("ressonancias"),
        sessoes: coletarExames("sessoes"),
        avulsos: coletarExames("avulsa"),
      },
      atestado: {
        necessidade: $("#txt-necessidade").val().trim(),
        dias: $("#num-dias").val(),
        cid: $("#txt-cid").val().trim(),
      },
      anexos: coletarAnexos(),
    };

    return formData;
  }

  function coletarMedicamentos() {
    const medicamentos = [];

    $(".prescription-item").each(function () {
      const $item = $(this);
      const medicamento = {
        nome: $item.find('input[name="medicamento[]"]').val(),
        posologia: $item.find('input[name="posologia[]"]').val(),
        via: $item.find('input[name="via[]"]').val(),
        quantidade: $item.find('input[name="quantidade[]"]').val(),
        cid: $item.find('input[name="cid[]"]').val(),
      };

      // Aplicar trim() apenas se o valor existir
      Object.keys(medicamento).forEach((key) => {
        if (medicamento[key] !== undefined && medicamento[key] !== null) {
          medicamento[key] = medicamento[key].toString().trim();
        } else {
          medicamento[key] = "";
        }
      });

      // Só adiciona se houver pelo menos o nome do medicamento
      if (medicamento.nome) {
        medicamentos.push(medicamento);
      }
    });

    return medicamentos;
  }

  function coletarExames(section) {
    const exames = [];

    $(`input[name="exame-${section}[]"]`).each(function () {
      const exame = $(this).val().trim();
      if (exame) exames.push(exame);
    });

    return exames;
  }

  function coletarAnexos() {
    const anexos = [];

    $("#files-container .file-item").each(function () {
      anexos.push($(this).find("span").text().trim());
    });

    return anexos;
  }

  // Função de simulação de envio AJAX (substituir pela real depois)
  function enviarDadosAtendimento(formData) {
    return new Promise((resolve, reject) => {
      console.log("Simulando envio AJAX...", formData);

      // Simula tempo de requisição (1-2s)
      const tempoAleatorio = Math.random() * 1000 + 1000;

      setTimeout(() => {
        // Simula 90% de chance de sucesso
        if (Math.random() > 0.1) {
          console.log("Simulação: Dados enviados com sucesso!");
          resolve({ success: true });
        } else {
          console.log("Simulação: Erro no envio!");
          reject(new Error("Erro simulado no servidor"));
        }
      }, tempoAleatorio);
    });
  }

  // Animação ao carregar a página
  anime({
    targets: ".glass-card",
    opacity: [0, 1],
    translateY: [20, 0],
    delay: anime.stagger(100),
    duration: 600,
    easing: "easeOutExpo",
  });
});

function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  document.getElementById("currentDateTime").textContent =
    now.toLocaleDateString("pt-BR", options);
}

// Atualizar imediatamente e depois a cada segundo
updateDateTime();
setInterval(updateDateTime, 1000);
