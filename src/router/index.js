import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Carrinho from '../components/Carrinho.vue'
import Produto from '../components/Produto.vue'
import Login from '../components/Login.vue'
import CadastroCliente from '../components/CadastroCliente.vue'
import CadastroProduto from '../components/CadastroProduto.vue'
import ListaCadastro from '../components/ListaCadastro.vue'
import Perfil from '../components/perfil.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/carrinho',
    name: 'Carrinho',
    component: Carrinho
  },
  {
    path: '/produto',
    name: 'Produto',
    component: Produto
    },
    {
      path: '/cadastroproduto',
      name: 'CadastroProduto',
      component: CadastroProduto
      },
      {
        path: '/login',
        name: 'Login',
        component: Login
        },
        {
          path: '/cadastrocliente',
          name: 'CadastroCliente',
          component: CadastroCliente
          },
          {
            path: '/registro',
            name: 'Registro',
            component: Login
          },
          {
            path: '/listarproduto',
            name: 'ListaCadastro',
            component: ListaCadastro
          },
          {
            path: '/perfil',
            name: 'Perfil',
            component: Perfil
          },
        

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
