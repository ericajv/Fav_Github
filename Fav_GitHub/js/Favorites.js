import { GithubUser } from "./GithubUser.js"


//classe que vai conter logica dos dados de como eles serão organizados (guardar a logica dos dados)

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root) //Aqui é o div id=app
        this.load()

       //GithubUser.search('diego3g').then(user => console.log(user))

    }
    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
    async add(username) {

        try {
            const userExists = this.entries.find(entry => entry.login === username)
            if (userExists){
                throw new Error('Usuário já cadastrado')

            }


            const user = await GithubUser.search(username)
            if (user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]

            this.update()
            this.save()

        } catch (error) {
            alert(error.message)

        }

    }


    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }


}


//classe que vai criar a visualização e eventos do HTML (construir a tabela)

export class FavoritesView extends Favorites {

    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()

    }

    onadd() {

        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)

        }


    }

    update() {     //essa função é para toda vez que mudar algum dado.
        this.removeAlltr()

        this.entries.forEach(user => {
            const row = this.creatRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`

            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login

            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }


            }

            this.tbody.append(row)
        })
    }


    creatRow() {
        const tr = document.createElement('tr')

        tr.innerHTML =
            `
          <td class="user">
            <img src="https://github.com/ericajv.png" alt="Imagem Érica">
            <a href="https://github.com/ericajv" target="_blank">
              <p>Érica Vieira</p>
              <span>ericajv</span>
            </a>

          </td>
          <td class="repositories">
            48
          </td>
          <td class="followers">
            22503
          </td>
          <td>
            <button class="remove">&times;</button>
          </td>
            `
        return tr

    }



    removeAlltr() {  //remove todas tr(linhas)

        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }

}