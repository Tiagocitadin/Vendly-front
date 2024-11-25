// auth.js
import { reactive } from "vue";

export const authState = reactive({
  usuarioLogado: JSON.parse(localStorage.getItem("usuarioLogado")) || null,
  isLoggedIn: !!localStorage.getItem("usuarioLogado"),
});

export function loginUsuario(usuario) {
  localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
  authState.usuarioLogado = usuario;
  authState.isLoggedIn = true;
}

export function logoutUsuario() {
  localStorage.removeItem("usuarioLogado");
  authState.usuarioLogado = null;
  authState.isLoggedIn = false;
}
