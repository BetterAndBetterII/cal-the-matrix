# cal-the-matrix
A webpage based matrix calculator.
要开发一个使用 Vue 来实现的线性代数计算器静态网页，您可以按照以下步骤和框架进行：

### 1. 设计和框架

#### 前端技术栈:
- **Vue.js**: 作为主要的前端框架。
- **Vuex**: 管理应用的状态。
- **Bootstrap Vue**: 提供现成的 UI 组件。
- **MathJax**: 用于数学公式的实时渲染。
- **自制识别接口**: 用于识别用户剪切板的矩阵

#### 布局:
- **左侧边栏**: 提供计算模式的选择（矩阵相乘、求逆矩阵等）。
- **主内容区**: 用户输入矩阵并显示计算结果。

### 2. 组件设计

#### a. 计算模式选择组件
- 列出所有支持的计算模式。
- 让用户选择一个模式。

#### b. 矩阵输入组件
- 提供动态的输入字段，让用户能输入不同大小的矩阵。
- 验证输入是否为有效的数值。

#### c. 公式显示组件
- 使用 MathJax 或 KaTeX 将用户输入的矩阵转换成公式并显示。

#### d. 计算结果组件
- 显示计算结果。
- 同样使用数学公式渲染。

### 3. 数据流和状态管理

- 使用 Vuex 来管理应用状态（例如，当前选择的计算模式，用户输入的矩阵等）。
- 当用户改变计算模式或更新矩阵输入时，应用状态应相应更新。

### 4. 逻辑实现

#### 计算逻辑
- 实现不同的计算逻辑（矩阵相乘、求逆等）。
- 可以考虑使用现成的数学库，如 math.js，来处理复杂的矩阵运算。

#### 用户输入处理
- 确保用户输入的是有效的矩阵。
- 对于不合法的输入，提供友好的错误信息。

### 5. 用户界面和交互

- 设计直观、用户友好的界面。
- 在用户进行输入或选择时提供实时反馈。

### 6. 测试和优化

- 对不同的组件和功能进行单元测试。
- 确保网页在不同的设备和浏览器上表现良好。

### 7. 部署

- 将完成的网站部署到服务器上。


## 学习路线

1. [Vue.js](https://cn.vuejs.org/v2/guide/)
### vue的介绍
Vue.js（读音 /vjuː/, 类似于 view） 是一套构建用户界面的渐进式框架。Vue 只关注视图层，采用自底向上增量开发的设计。

Vue 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

也就是说，vue类似于一个脚手架，可以帮助我们快速的搭建一个网页，而不用去关心网页的底层实现。
### vue的安装
vue可以通过npm包管理器进行安装，不清楚npm的可以参考下面的npm的介绍。

安装vue的命令如下：
```bash
npm install -g @vue/cli
```

安装完成后，可以通过下面的命令查看vue的版本：
```bash
vue --version
```

### 新建vue项目
安装完vue后，可以通过下面的命令新建一个vue项目：
```bash
vue create <project-name>
```

Vue.js 项目的目录结构可能会根据不同的构建工具和个人习惯有所不同，但通常遵循以下基本结构：

```
my-vue-app/
|-- node_modules/
|-- public/
|   |-- favicon.ico
|   |-- index.html
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- HelloWorld.vue
|   |-- router/
|   |   |-- index.js
|   |-- store/
|   |   |-- index.js
|   |-- views/
|   |   |-- Home.vue
|   |   |-- About.vue
|   |-- App.vue
|   |-- main.js
|-- .gitignore
|-- babel.config.js
|-- package.json
|-- README.md
```

### 目录说明:

- **node_modules/**: 存放项目所依赖的模块，这些模块通过 npm 或 yarn 安装。

- **public/**: 包含静态资源，如 `index.html` 文件。这是应用的入口文件，其中会引入构建好的 JavaScript 和 CSS 文件。

- **src/**: 这是 Vue 应用的主要源代码目录。
    - **assets/**: 存放静态资源，如图片、样式文件等。
    - **components/**: Vue 组件文件，这些是可重用的 Vue 组件。
    - **router/**: Vue Router 文件，用于定义应用的路由。
    - **store/**: Vuex 状态管理文件。
    - **views/**: 存放 Vue 页面组件，通常和路由相关联。
    - **App.vue**: 应用的主组件。
    - **main.js**: 应用的入口 JS 文件，用于创建 Vue 实例、导入必要的插件等。

- **.gitignore**: 配置 Git 忽略的文件和目录。

- **babel.config.js**: Babel 的配置文件，用于设置 JS 编译选项。

- **package.json**: 定义项目的依赖关系、脚本、版本等信息。

- **README.md**: 项目的说明文件，通常包含项目介绍、安装步骤等。

这个结构是 Vue CLI 创建的标准结构，但您可以根据项目的需要对其进行调整。例如，您可能会添加额外的目录，如 `services`（用于处理 API 调用）或 `utils`（用于通用的帮助函数）。

### 创建按钮，表单，并处理事件

在 Vue 中，创建按钮和表单以及处理它们的事件是基础但非常重要的。

#### a. 创建按钮
- 在 Vue 组件的模板部分，可以使用 HTML 标签来创建一个按钮：
  ```html
  <template>
    <button @click="greet">点击我</button>
  </template>
  ```

#### b. 创建表单
- 表单通常包括输入框、选择框、复选框等元素。例如，创建一个简单的文本输入框：
  ```html
  <template>
    <input v-model="message" placeholder="输入一些文本">
  </template>
  ```

#### c. 处理事件
- 事件处理是与用户交互的关键。在 Vue 中，可以使用 `v-on` 指令或 `@` 符号监听 DOM 事件。
- 例如，为按钮添加一个点击事件：
  ```javascript
  <script>
  export default {
    methods: {
      greet() {
        alert("Hello, Vue!");
      }
    }
  };
  </script>
  ```

#### d. 数据绑定
- 使用 `v-model` 实现表单元素的双向数据绑定。这意味着输入字段的值和 Vue 实例的数据可以相互保持同步。
  ```javascript
  <script>
  export default {
    data() {
      return {
        message: ''
      };
    }
  };
  </script>
  ```

### 使用 Vue 的计算属性和侦听器

这两个特性使得处理复杂逻辑和响应数据变化变得简单。

#### a. 计算属性（Computed Properties）
- 计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。
- 示例：创建一个计算属性来反转消息文本。
  ```javascript
  <script>
  export default {
    data() {
      return {
        message: 'Hello'
      };
    },
    computed: {
      reversedMessage() {
        return this.message.split('').reverse().join('');
      }
    }
  };
  </script>
  ```

#### b. 侦听器（Watchers）
- 侦听器用于观察和响应 Vue 实例的数据变动。当监视的数据变化时，可以执行特定的操作。
- 示例：监视 `message` 数据项，并在其变化时执行操作。
  ```javascript
  <script>
  export default {
    data() {
      return {
        message: ''
      };
    },
    watch: {
      message(newVal, oldVal) {
        console.log(`消息从 ${oldVal} 改变为 ${newVal}`);
      }
    }
  };
  </script>
  ```

### 使用 Vue 的路由和状态管理

路由和状态管理是构建复杂应用程序时的关键概念。

#### a. 路由（Vue Router）
- Vue Router 是 Vue.js 的官方路由管理器。它和 Vue.js 核心深度集成，使构建单页面应用变得易如反掌。
- **安装**: 使用 npm 或 yarn 安装 Vue Router。
  ```bash
  npm install vue-router
  ```
- **配置路由**: 定义路由映射和实例化 Vue Router。
  ```javascript
  import Vue from 'vue';
  import Router from 'vue-router';
  import Home from './views/Home.vue';

  Vue.use(Router);

  export default new Router({
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      }
      // 其他路由规则
    ]
  });
  ```
- **在组件中使用路由**: 使用 `<router-link>` 创建导航链接，使用 `<router-view>` 显示路由视图。

#### b. 状态管理（Vuex）
- Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。
- **安装**: 使用 npm 或 yarn 安装 Vuex。
  ```bash
  npm install vuex
  ```
- **创建 Store**: Store 是包含应用中所有组件的状态的地方。
  ```javascript
  import Vue from 'vue';
  import Vuex from 'vuex';

  Vue.use(Vuex);

  export default new Vuex.Store({
    state: {
      // 应用级状态
    },
    mutations: {
      // 同步修改状态的方法
    },
    actions: {
      // 异步操作
    }
  });
  ```
- **在组件中使用 Vuex**: 组件可以通过 `this.$store` 访问 Vuex store。

这是一个非常基础的介绍，针对每个概念，建议深入阅读官方文档和相关教程以获得更全面的理解和实践。

### 使用 Vue 的自定义指令

自定义指令是 Vue 的一个强大功能，它允许你创建可重复使用的指令，这些指令可以应用于 HTML 元素，实现特定的功能。

#### a. 创建自定义指令
- **定义**: 在 Vue 中，可以通过全局方法 `Vue.directive()` 或在组件内部使用 `directives` 选项来定义自定义指令。
- **示例**: 创建一个自定义指令，让元素在鼠标悬停时变色。
  ```javascript
  Vue.directive('hover-color', {
    bind(el, binding) {
      el.style.color = binding.value || 'blue';
      el.onmouseover = () => { el.style.color = 'red'; };
      el.onmouseout = () => { el.style.color = binding.value || 'blue'; };
    }
  });
  ```
- **使用**: 在模板中使用自定义指令。
  ```html
  <template>
    <div v-hover-color="'green'">悬停我看看</div>
  </template>
  ```

#### b. 自定义指令的钩子函数
- **bind**: 当指令第一次绑定到元素时调用。
- **inserted**: 被绑定元素插入父节点时调用。
- **update**: 所在组件的 VNode 更新时调用。
- **componentUpdated**: 所在组件的 VNode 及其子 VNode 全部更新后调用。
- **unbind**: 指令与元素解绑时调用。

#### c. 动态指令参数
- 自定义指令可以接受动态参数，这些参数可以在模板中动态改变。
- 例如，`v-hover-color:[param]="'green'"`，其中 `[param]` 是动态参数。

### 使用 Vue 的部署

部署 Vue 应用涉及将开发好的应用打包并上传到服务器或静态网站托管服务。

#### a. 构建生产版本
- 使用 Vue CLI，可以通过运行以下命令来为应用创建生产版本：
  ```bash
  npm run build
  ```
- 这会在项目目录中生成一个 `dist/` 文件夹，其中包含优化后的文件，适合部署。

#### b. 部署选项
- **静态网站托管服务**: 例如 GitHub Pages、Netlify、Vercel。这些服务通常提供简便的部署流程。
- **自己的服务器**: 如果您有自己的服务器，可以通过 FTP 或 SSH 将 `dist/` 目录中的文件上传到服务器。

#### c. 路径配置
- 在部署前，确保 Vue 应用中的路由和资源路径正确设置。例如，对于 GitHub Pages，可能需要设置基路径。
- 在 `vue.config.js` 中设置 `publicPath`：
  ```javascript
  module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/my-project/'
      : '/'
  }
  ```

#### d. 持续集成/持续部署 (CI/CD)
- 对于频繁更新的应用，可以设置 CI/CD 流程，以自动化构建和部署过程。
- 工具如 GitHub Actions 或 GitLab CI/CD 可以在代码提交到仓库后自动进行构建和部署。

这个指南涵盖了 Vue 自定义指令的创建和使用，以及 Vue 应用的基本部署流程。对于零基础用户来说，理解并运用这些概念可能需要一些时间和实践，但这是掌握 Vue 开发的重要步骤。

### Vuex 的基本使用

Vuex 是专为 Vue.js 应用程序开发的状态管理模式和库。

#### a. 状态管理概念
- **状态（state）**: 应用级的共享数据。
- **视图（view）**: 声明式地将状态映射到视图。
- **行为（actions）**: 响应在视图上的用户输入导致的状态变化。

#### b. 安装 Vuex
- 使用 npm 或 yarn 安装 Vuex：
  ```bash
  npm install vuex
  # 或者
  yarn add vuex
  ```

#### c. 创建 Store
- **Store** 是存储所有应用状态的地方。
- 创建 `store.js` 并添加基本的 Vuex store。
  ```javascript
  import Vue from 'vue';
  import Vuex from 'vuex';

  Vue.use(Vuex);

  export default new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
      increment(state) {
        state.count++;
      }
    }
  });
  ```

#### d. 在组件中使用 Vuex
- 在 Vue 组件中使用 `this.$store` 访问 Vuex store。
- 使用 `commit` 方法触发状态变更。
  ```html
  <template>
    <div>
      {{ count }}
      <button @click="increment">增加</button>
    </div>
  </template>

  <script>
  export default {
    computed: {
      count() {
        return this.$store.state.count;
      }
    },
    methods: {
      increment() {
        this.$store.commit('increment');
      }
    }
  };
  </script>
  ```

### Vuex 的进阶使用

#### a. 使用 Getters
- Getters 允许你定义可复用的计算属性。
- 在 `store.js` 中定义 getter。
  ```javascript
  const store = new Vuex.Store({
    state: {
      todos: [
        { id: 1, text: '...', done: true },
        { id: 2, text: '...', done: false }
      ]
    },
    getters: {
      doneTodos: state => {
        return state.todos.filter(todo => todo.done);
      }
    }
  });
  ```

#### b. Actions
- Actions 类似于 mutations，不同在于 actions 提交的是 mutation，而不是直接变更状态。
- Actions 可以包含任意异步操作。
  ```javascript
  const store = new Vuex.Store({
    // ...
    actions: {
      incrementAsync ({ commit }) {
        setTimeout(() => {
          commit('increment');
        }, 1000);
      }
    }
  });
  ```

#### c. 模块化（Modules）
- Vuex 允许将 store 分割成模块（module），每个模块拥有自己的 state、mutation、action、getter。
- 对于大型应用，模块化是保持代码整洁和管理复杂状态的关键。
  ```javascript
  const moduleA = {
    state: { /* ... */ },
    mutations: { /* ... */ },
    actions: { /* ... */ },
    getters: { /* ... */ }
  }

  const moduleB = {
    state: { /* ... */ },
    // ...
  }

  const store = new Vuex.Store({
    modules: {
      a: moduleA,
      b: moduleB
    }
  })
  ```

### 总结
Vuex 的基本使用涉及到管理应用的中央状态、实施同步和异步的变更操作。进阶使用则包括利用 getters 提高性能，通过 actions 处理异步逻辑，以及模块化管理大型应用的状态。虽然 Vuex 提供了强大的工具集，但它也增加了应用的复杂性。因此，对于简单的应用，仅使用 Vue 的本地状态管理可能更合适。而对于需要处理多个组件共享状态的复杂应用，Vuex 就显得非常有用了。
3. [Bootstrap Vue](https://bootstrap-vue.org/docs)

### [Bootstrap Vue 官方文档](https://bootstrap-vue.org/docs)

Bootstrap Vue 是一个将 Bootstrap 4 集成到 Vue.js 的库。它提供了一系列的响应式组件和插件，使开发者能够轻松地在 Vue 应用中使用 Bootstrap 功能。

### Bootstrap Vue 的安装

安装 Bootstrap Vue 是开始使用它的第一步。

#### a. 使用 NPM 安装
- 如果你的项目中已经安装了 Vue，可以通过以下命令安装 Bootstrap Vue：
  ```bash
  npm install bootstrap-vue bootstrap
  ```

#### b. 在项目中引入 Bootstrap Vue
- 在项目的主入口文件（通常是 `main.js` 或 `app.js`）中引入 Bootstrap Vue 和 Bootstrap CSS 文件。
  ```javascript
  import Vue from 'vue';
  import BootstrapVue from 'bootstrap-vue';
  import 'bootstrap/dist/css/bootstrap.css';
  import 'bootstrap-vue/dist/bootstrap-vue.css';

  Vue.use(BootstrapVue);
  ```

### Bootstrap Vue 的基本使用

使用 Bootstrap Vue 的基础在于理解其提供的布局和组件系统。

#### a. 布局
- Bootstrap Vue 使用基于行和列的网格系统来创建响应式布局。
- 使用 `<b-container>`, `<b-row>`, 和 `<b-col>` 组件来创建布局。
  ```html
  <b-container>
    <b-row>
      <b-col>第一列内容</b-col>
      <b-col>第二列内容</b-col>
    </b-row>
  </b-container>
  ```

#### b. 文本和颜色
- Bootstrap Vue 提供了各种文本和背景颜色类。
- 可以直接在组件上使用这些类来改变颜色。
  ```html
  <b-container class="bg-primary text-white">
    <b-row>
      <b-col>彩色背景</b-col>
    </b-row>
  </b-container>
  ```

### 常用的预布局

Bootstrap Vue 通过预定义的布局组件，使页面布局变得简单。

#### a. 表格布局
- `<b-table>` 组件用于创建表格。
- 支持排序、过滤、分页等功能。

#### b. 表单布局
- 使用 `<b-form>`, `<b-form-group>`, `<b-form-input>` 等组件来创建表单。
- 支持验证、输入框、选择框、单选按钮等。

#### c. 卡片布局
- `<b-card>` 组件用于创建卡片布局，适用于展示内容块。

### 常用的组件

Bootstrap Vue 提供了一系列的组件，用于快速开发。

#### a. 按钮
- `<b-button>` 用于创建按钮，支持多种样式和大小。
- 可以设置 `variant` 属性来改变按钮样式。

#### b. 模态框（Modal）
- `<b-modal>` 用于创建模态框，适用于对话框、确认框等。

#### c. 下拉菜单（Dropdown）
- `<b-dropdown>` 用于创建下拉菜单，支持触发方式和位置的自定义。

#### d. 导航栏（Navbar）
- `<b-navbar>` 用于创建响应式导航栏。

#### e. 分页（Pagination）
- `<b-pagination>` 用于创建分页导航。

#### f. 轮播图（Carousel）
- `<b-carousel>` 用于创建轮播图，支持控制和指示器。

### 总结

Bootstrap Vue 是一个功能丰富的库，将 Bootstrap 的样式和响应式布局引入 Vue 应用。通过使用它提供的各种组件和布局工具，即使是初学者也能快速构建出美观且响应式的界面。建议在开始使用前阅读官方文档，以更
4. [MathJax](https://www.mathjax.org/)

### [MathJax 官方网站](https://www.mathjax.org/)

MathJax 是一个开源的 JavaScript 显示引擎，用于在网页上显示数学公式。它支持多种数学标记语言，如 LaTeX、MathML 和 AsciiMath。

### MathJax 的 CDN 使用方法

使用 CDN (内容分发网络) 是一种快速且简便的方式来引入 MathJax 到你的网页中。

#### a. 引入 MathJax
- 你可以通过在 HTML 文件的 `<head>` 部分添加以下代码来引入 MathJax：
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML" async></script>
  ```
- 这行代码使用了 Cloudflare 的 CDN 来加载 MathJax，并指定了一个配置文件。

#### b. 在网页中使用
- 在网页的任何地方使用 MathJax 支持的数学标记来编写数学公式。
- 例如，使用 LaTeX 语法编写一个二次方程式：
  ```html
  <p>二次方程式: \( ax^2 + bx + c = 0 \)</p>
  ```
- MathJax 将自动渲染页面上的数学公式。

### 一些配置

MathJax 提供了多种配置选项，允许你自定义公式的显示方式。

#### a. 配置脚本
- 你可以通过在引入 MathJax 之前添加配置脚本来自定义 MathJax 的行为。
- 以下是一个配置示例：
  ```html
  <script type="text/x-mathjax-config">
    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        processEscapes: true
      }
    });
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML" async></script>
  ```

#### b. 自定义行内公式分隔符
- 在上述配置中，`tex2jax` 对象定义了行内数学公式的分隔符。默认情况下，MathJax 使用 `\( ... \)`，但你可以修改它，例如使用 `$...$`。

#### c. 跳过特定内容
- 如果你想让 MathJax 跳过处理某些内容，可以在该内容的 HTML 标签上添加 `class="no-mathjax"`。

#### d. 延迟渲染
- 如果你的网页动态加载内容，可能需要在内容加载后告诉 MathJax 重新处理页面。这可以通过调用 `MathJax.Hub.Queue(["Typeset", MathJax.Hub])` 实现。

### 总结

MathJax 是在网页上显示数学公式的强大工具，通过 CDN 的方式可以很容易地在你的网站中使用它。通过简单的配置，你可以定制 MathJax 的行为，以适应你的特定需求。对于初学者来说，理解基本的使用方法和配置选项是开始使用 MathJax 的重要步骤。
5. [git](https://github.com/git-guides/install-git)

### [Git 官方网站](https://github.com/git-guides/install-git)

Git 是一个广泛使用的版本控制系统，它帮助团队和个人管理和跟踪代码的历史更改。

### Git 的安装

安装 Git 是开始使用它的第一步。

#### a. Windows
- 访问 [Git 官方网站](https://git-scm.com/) 并下载 Windows 版的 Git 安装程序。
- 运行安装程序，并按照指示完成安装。
- 安装完成后，可以通过打开命令提示符（CMD）或 Git Bash 并输入 `git --version` 来验证安装。
- 当然，如果你不喜欢命令行的形式，你可以使用github desktop，这是一个图形化的git工具，可以在[这里](https://desktop.github.com/)下载。

#### b. MacOS
- 在 macOS 上，可以通过 Homebrew 来安装 Git。
- 在终端中输入以下命令安装 Homebrew（如果尚未安装）：
  ```bash
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
- 接着，使用 Homebrew 安装 Git：
  ```bash
  brew install git
  ```

#### c. Linux
- 在基于 Debian 的 Linux 发行版（如 Ubuntu）中，通过以下命令安装 Git：
  ```bash
  sudo apt-get update
  sudo apt-get install git
  ```
- 对于其他 Linux 发行版，请参考各自的包管理器进行安装。

### Git 的基本使用

使用 Git 主要涉及在命令行中执行一系列的命令来管理代码的版本。

#### a. 初始化仓库
- 在项目目录中使用 `git init` 命令来初始化一个新的 Git 仓库。

#### b. 跟踪文件
- 使用 `git add <file>` 命令来添加文件到暂存区。
- 使用 `git add .` 添加所有更改过的文件到暂存区。

#### c. 提交更改
- 使用 `git commit -m "<commit message>"` 命令来提交更改。提交信息应简洁明了地描述所做的更改。

### 常用 Git 命令

#### a. Commit
- 提交（Commit）是 Git 中的一个基本概念，代表对仓库的一次更改。
- `git commit` 命令用于创建一个新的提交。

#### b. Push
- Push 操作用于将本地的更改推送到远程仓库。
- `git push` 命令通常用于将提交推送到 GitHub 或其他 Git 服务器。

#### c. Pull
- Pull 操作用于从远程仓库获取最新更改并合并到本地仓库。
- `git pull` 命令结合了 `git fetch` 和 `git merge` 的功能。

#### d. Branch
- 分支（Branch）允许你在不同的线路上开发和测试新功能。
- `git branch` 命令用于列出、创建或删除分支。

#### e. Merge
- 合并（Merge）是将一个分支的更改合并到另一个分支的操作。
- `git merge <branch>` 用于合并指定分支到当前分支。

#### f. Rebase
- 变基（Rebase）是一种合并分支的替代方法，它通过重新应用一个分支上的更改来整理提交历史。
- `git rebase <branch>` 用于将当前分支的更改应用到 `<branch>` 分支上。

### 总结

Git 是一个非常强大的工具，对于团队协作和代码版本控制来说至关重要。理解 Git 的基本概念和命令是每个开发者必备的技能。对于初学者来说，从基础开始并逐步深入是学习 Git 的最佳途径。

### 6. [Markdown 基本语法](https://www.markdownguide.org/basic-syntax/)

Markdown 是一种轻量级标记语言，用于创建格式化文本，广泛用于撰写 README 文件、论坛帖子、博客文章等。

#### Markdown 的基本使用
- **标题**: 使用 `#` 符号来创建标题。`#` 的数量表示标题的级别。
  ```markdown
  # 标题 1
  ## 标题 2
  ### 标题 3
  ```
- **段落和换行**: 直接书写文本创建段落，使用两个空格加回车来换行。
- **强调**: 使用 `*` 或 `_` 来强调文本。单个符号用于斜体，双重符号用于粗体。
  ```markdown
  *斜体* 或 _斜体_
  **粗体** 或 __粗体__
  ```
- **链接**: 使用 `[链接文本](URL)` 来创建链接。
  ```markdown
  [Markdown Guide](https://www.markdownguide.org)
  ```
- **列表**: 使用 `*`、`+` 或 `-` 创建无序列表，使用数字创建有序列表。
  ```markdown
  - 项目 1
  - 项目 2
    - 子项目 a
    - 子项目 b
  ```
- **代码**: 使用反引号 \` 来标记代码。三个反引号 ``` 用于多行代码块。
  ```markdown
  `代码`
  
  ```
  多行代码
  ```
  ```
- **图片**: 使用 `![替代文本](图片URL)` 来插入图片。
  ```markdown
  ![Logo](https://example.com/logo.png)
  ```

### 7. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

Live Server 是 Visual Studio Code (VS Code) 的一个插件，它可以快速在本地启动一个开发服务器，实时预览 HTML 文件。

#### Live Server 的安装和使用
- **安装**:
  1. 在 VS Code 中打开扩展视图。
  2. 搜索 “Live Server” 并选择由 Ritwick Dey 开发的插件。
  3. 点击安装。
- **使用**:
  1. 打开一个 HTML 文件。
  2. 点击 VS Code 状态栏底部的 “Go Live” 按钮来启动服务器。
  3. 浏览器将自动打开并显示该 HTML 文件。
  4. 当你更改并保存文件时，浏览器视图将自动更新。

### 8. [npm](https://www.runoob.com/nodejs/nodejs-npm.html)

npm (Node Package Manager) 是 Node.js 的包管理器，用于安装和管理 Node.js 应用的依赖。

#### npm 的介绍
- npm 是世界上最大的软件注册中心，提供大量可重用代码。
- 它允许开发者下载别人编写的代码模块（即“包”）。

#### npm 的安装和使用
- **安装**:
  - npm 通常与 Node.js 一起安装。从 [Node.js 官方网站](https://nodejs.org/) 下载并安装 Node.js，npm 将自动安装。
- **使用**:
  1. **初始化新项目**: 在项目目录中运行 `npm init`，它会帮助你创建一个 `package.json` 文件，该文件包含了项目的元数据。
  2. **安装包**: 使用 `npm install <包名>` 来安装一个新的包。
  3. **查看已安装包**: 运行 `npm list` 查看当前项目安装的包。
  4. **更新包**: 使用 `npm update <包名>` 来更新特定包。
  5. **移除包**: 使用 `npm uninstall <包名>` 来移除不再需要的包。

通过这些基础知识，零基础的用户可以开始探索 Markdown、Live Server 和 npm 的强大功能，并将它们应用到自己的开发流程中。