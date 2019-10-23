import "../styles/index.scss";

class Store {
  constructor() {
    this.items = [];
  }

  addItem = text => {
    let newItem = {
      id: this.items.length,
      text,
      completed: false
    };
    this.items = [...this.items, newItem];
  };

  removeItem = id => {
    let newItems = this.items.filter(val => val.id !== id);
    this.items = newItems;
  };

  toggleCompleted = id => {
    let items = this.items.map(val => {
      if (id === val.id) {
        val.completed = !val.completed;
        return val;
      }
      return val;
    });
  };

  getActiveItems = () => {
    return this.items.filter(val => val.completed === false);
  };

  clearAll = () => {
    this.items = [];
  };
}

class ToDoItem {
  constructor({ text, completed, id }) {
    this.text = text;
    this.completed = completed;
    this.id = id;
  }

  render = () => {
    let el = document.createElement("li");
    el.innerText = this.text;
    el.className = "todo-item";
    el.className += this.completed ? " completed" : " active";
    el.dataset.id = this.id;
    el.addEventListener("click", e => {
      controller.toggleCompleted(this.id);
    });

    document.querySelector("#js-list").appendChild(el);
  };
}

class UserInput {
  constructor() {
    this._init();
  }

  _init() {
    this._buildView();
    let addButton = document.querySelector("#js-add-item");
    let filterAll = document.querySelector("#js-filter-all");
    let filterActive = document.querySelector("#js-filter-active");
    let clearAll = document.querySelector("#js-filter-clear");

    addButton.addEventListener("click", e => {
      let val = document.querySelector("#js-input-field").value;
      controller.createItem(val);
      document.querySelector("#js-input-field").value = "";
    });

    filterAll.addEventListener("click", e => {
      controller.renderList(); // Defaults to show all items
      filterActive.classList.remove("text-green-500");
      filterAll.classList.add("text-green-500");
    });

    filterActive.addEventListener("click", e => {
      controller.showActive();
      filterActive.classList.add("text-green-500");
      filterAll.classList.remove("text-green-500");
    });

    clearAll.addEventListener("click", e => {
      controller.clearAll();
    });
  }

  _buildView() {
    let root = document.querySelector("#js-user-input");

    root.innerHTML = `<input
        placeholder="Add new item..."
        type="text"
        id="js-input-field"
        class="p-4 rounded bg-gray-900 text-white w-full shadow-inner outline-none"
      />
      <button
      id="js-add-item"
        class="bg-green-400 hover:shadow-md text-gray-900 font-semibold py-2 px-4 absolute right-0 mr-2 rounded shadow focus:outline-none focus:shadow-none"
      >
        Add
      </button>`;
  }
}

class Controller {
  constructor(store) {
    this.store = store;
  }

  init = () => {
    this.renderList();
    const input = new UserInput();
  };

  renderList = (list = this.store.items) => {
    let listParent = document.querySelector("#js-list");
    listParent.innerHTML = "";
    list.forEach(val => {
      let item = new ToDoItem(val);
      item.render();
    });
    if (list.length === 0) {
      listParent.innerHTML = `<span class="text-center inline-block w-full p-4 text-gray-600 text-xs">Add a new item to get started!</span>`;
    }
  };

  createItem = val => {
    let newItem = this.store.addItem(val);
    this.renderList();
  };

  toggleCompleted = id => {
    this.store.toggleCompleted(id);
    this.renderList();
  };

  showActive = () => {
    let list = this.store.getActiveItems();
    this.renderList(list);
  };

  clearAll = () => {
    this.store.clearAll();
    this.renderList();
  };
}

const store = new Store();
const controller = new Controller(store);
controller.init();
