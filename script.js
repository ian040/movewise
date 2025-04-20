let editIndex = -1;

window.onload = () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (usuarioLogado) mostrarDashboard();
};

function toggleAuth() {
  const title = document.getElementById("auth-title");
  const btn = document.querySelector("#auth button");
  const link = document.querySelector("#auth a");

  if (title.innerText === "Login") {
    title.innerText = "Cadastro";
    btn.innerText = "Criar Conta";
    btn.onclick = cadastrar;
    link.innerText = "Já tem conta? Entrar";
  } else {
    title.innerText = "Login";
    btn.innerText = "Entrar";
    btn.onclick = login;
    link.innerText = "Criar conta";
  }
}

function cadastrar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  if (!email || !senha) return alert("Preencha todos os campos.");

  let dados = JSON.parse(localStorage.getItem("usuarios") || "{}");

  if (dados[email]) {
    return alert("Usuário já existe.");
  }

  dados[email] = {
    senha: senha,
    agendamentos: []
  };

  localStorage.setItem("usuarios", JSON.stringify(dados));
  alert("Conta criada! Faça login.");
  toggleAuth();
}

function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  let dados = JSON.parse(localStorage.getItem("usuarios") || "{}");

  if (!dados[email] || dados[email].senha !== senha) {
    return alert("Usuário ou senha inválidos.");
  }

  localStorage.setItem("usuarioLogado", email);
  mostrarDashboard();
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  location.reload();
}

function mostrarDashboard() {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  carregarAgendamentos();

  document.getElementById("form-agendamento").onsubmit = salvarAgendamento;
}

function carregarAgendamentos() {
  const email = localStorage.getItem("usuarioLogado");
  const dados = JSON.parse(localStorage.getItem("usuarios"));
  const agendamentos = dados[email].agendamentos || [];

  const tbody = document.querySelector("#tabela-agendamentos tbody");
  tbody.innerHTML = "";

  agendamentos.forEach((ag, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ag.dataHora}</td>
      <td>${ag.embarque}</td>
      <td>${ag.desembarque}</td>
      <td>${ag.motorista}</td>
      <td>${ag.carro}</td>
      <td>
        <button onclick="editar(${i})">Editar</button>
        <button onclick="excluir(${i})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function salvarAgendamento(event) {
  event.preventDefault();

  const email = localStorage.getItem("usuarioLogado");
  const dados = JSON.parse(localStorage.getItem("usuarios"));

  const agendamento = {
    dataHora: document.getElementById("dataHora").value,
    embarque: document.getElementById("embarque").value,
    desembarque: document.getElementById("desembarque").value,
    motorista: document.getElementById("motorista").value,
    carro: document.getElementById("carro").value
  };

  if (!agendamento.dataHora || !agendamento.embarque || !agendamento.desembarque || !agendamento.motorista || !agendamento.carro) {
    return alert("Preencha todos os campos.");
  }

  if (editIndex >= 0) {
    dados[email].agendamentos[editIndex] = agendamento;
    editIndex = -1;
  } else {
    dados[email].agendamentos.push(agendamento);
  }

  localStorage.setItem("usuarios", JSON.stringify(dados));
  document.getElementById("form-agendamento").reset();
  carregarAgendamentos();
}

function editar(index) {
  const email = localStorage.getItem("usuarioLogado");
  const dados = JSON.parse(localStorage.getItem("usuarios"));
  const ag = dados[email].agendamentos[index];

  document.getElementById("dataHora").value = ag.dataHora;
  document.getElementById("embarque").value = ag.embarque;
  document.getElementById("desembarque").value = ag.desembarque;
  document.getElementById("motorista").value = ag.motorista;
  document.getElementById("carro").value = ag.carro;

  editIndex = index;
}

function excluir(index) {
  const email = localStorage.getItem("usuarioLogado");
  const dados = JSON.parse(localStorage.getItem("usuarios"));
  dados[email].agendamentos.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(dados));
  carregarAgendamentos();
}
