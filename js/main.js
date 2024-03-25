
var matrix1 = null;
var matrix2 = null;

var matrix1_ori = null;
var matrix2_ori = null;

var inputarea1Focusing = false;
var inputarea2Focusing = false;

var resultsStorage = {
    latex: '',
    simple: '',
    fullExpression: ''
};

var function_name = 'multiply';

var number_type = 'fractional';

async function show_warning(message, duration) {
    const warning = document.getElementById('warning');
    warning.innerHTML = message;
    warning.style.display = 'block';
    if (duration) {
        setTimeout(() => {
            warning.style.display = 'hide';
        }, duration);
    }
}

function show_loading() {
    const warning = document.getElementById('warning');
    warning.innerHTML = '正在计算...';
    warning.style.display = 'block';
}

function hide_warning() {
    const warning = document.getElementById('warning');
    warning.style.display = 'hide';
}

// ori -> matrix

function saveOri(ori) {  // ori -> matrix
    // determine where to store the matrix
    var to = null;
    // matrix1, matrix2
    if (inputarea1Focusing) {
        to = "matrix1";
    } else if (inputarea2Focusing) {
        to = "matrix2";
    } else {
        if (!matrix1) {
            to = "matrix1";
        }
        else if (!matrix2) {
            to = "matrix2";
        }
        else {
            show_warning('矩阵1和矩阵2都已存在', 5000);
        }
    }

    if (to == null) {
        return;
    }

    console.log('保存ori到:', ori, to);
    if (to == "matrix1") {
        inputarea1Focusing = false;
        inputarea2Focusing = true;
        matrix1_ori = ori;
        fromOriToMatrix(to);
    } else if (to == "matrix2") {
        inputarea1Focusing = true;
        inputarea2Focusing = false;
        matrix2_ori = ori;
        fromOriToMatrix(to);
    }
}

function fromOriToMatrix(targetId) {
    if (targetId == "matrix1" && matrix1_ori) {
        _fromOriToMatrix(matrix1_ori, "matrix1");
    }
    if (targetId == "matrix2" && matrix2_ori) {
        _fromOriToMatrix(matrix2_ori, "matrix2");
    }
}

function _fromOriToMatrix(ori, targetId) {
    console.log('fromOriToMatrix:', ori, targetId);
    // 2d-list or image
    if (ori instanceof String || typeof ori === 'string') {
        parseFromArray(ori, targetId);
    }
    else if (ori instanceof File) {
        parseFromImage(ori, targetId);
    }
    else {
        console.log('不支持的类型');
    }
}

// 这个函数会在用户粘贴图像时调用
function parseFromImage(imageFile, targetId) {
    console.log('handleImagePaste:', targetId);
    // 处理图像的代码...
    // 使用 FileReader 读取图片内容
    console.log('检测到粘贴的图像文件:', imageFile);
    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById(targetId + '-preview');
        const textarea = document.getElementById(targetId);
        // 显示图片预览
        preview.src = e.target.result;
        preview.style.display = 'block';
        // 隐藏并禁用 textarea
        textarea.style.display = 'none';
        textarea.disabled = true;
    };
    reader.readAsDataURL(imageFile);
    show_loading();
    ocr(imageFile).then((result) => {
        // result -> latex string
        console.log('识别结果:', result);
        try {
            var matrix = Matrix.parseFromLatex(result);
        }
        catch (e) {
            console.log('解析失败:', e);
            show_warning('解析失败，请重试' + e.message);
            return;
        }
        hide_warning();
        console.log('解析结果:', matrix);
        // 如果矩阵1已存在,matrix作为矩阵2,否则则为矩阵1
        if (targetId === 'matrix1') {
            matrix1 = matrix;
        } else if (targetId === 'matrix2') {
            matrix2 = matrix;
        }
        calculateMatrix();
    })
}

function parseFromArray(str, targetId) {
    // 2d-list
    console.log('parseFromArray:', str);
    // split by "," or " "
    try {
        const array = parseStringToArray(str);
        var matrix = new Matrix(array);
    }
    catch (e) {
        console.log('解析失败:', e);
        show_warning('解析失败：' + e.message);
        return;
    }
    console.log('parseFromArray:', matrix);
    if (targetId === 'matrix1') {
        matrix1 = matrix;
    } else if (targetId === 'matrix2') {
        matrix2 = matrix;
    }
    calculateMatrix();
}

function parseStringToArray(str) {
    // 去除首尾的空白字符和不规则的换行符，统一换行符为\n
    str = str.trim().replace(/\r\n?/g, '\n');

    // 分割字符串为行
    var lines = str.split('\n');

    // 准备一个数组来存放解析后的矩阵
    var matrix = [];

    // 遍历每一行
    lines.forEach(line => {
        // 使用正则表达式分割每行中的数字，支持的分隔符包括逗号、空格以及逗号后跟一个或多个空格
        var elements = line.trim().split(/,|\s+|,\s+/).filter(element => element !== '');

        // 将分割后的字符串数组转换为数字数组
        var numberArray = elements.map(element => {
            let number = parseFloat(element);
            if (isNaN(number)) throw '解析失败：包含非数字元素';
            return number;
        });

        // 将这行的数字数组添加到矩阵中
        matrix.push(numberArray);
    });

    // 检查矩阵是否每行列数一致
    const columnCount = matrix[0].length;
    const isUniform = matrix.every(row => row.length === columnCount);
    if (!isUniform) {
        throw '解析失败：矩阵行的列数不一致';
    }

    return matrix;
}


window.addEventListener('paste', function (event) {
    // 获取剪贴板中的所有项目
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let index in items) {
        const item = items[index];
        // 检查是否为图像
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
            // 调用函数处理图像
            // handleImagePaste(item.getAsFile(), targetId);
            saveOri(item.getAsFile());
        }
    }
});

function multiply_init() {
    // 初始化矩阵乘法功能
    document.getElementById('function-title').innerText = '矩阵乘法';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'block';
    calculateMatrix();
}

function inverse_init() {
    // 初始化矩阵求逆功能
    document.getElementById('function-title').innerText = '矩阵求逆';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function add_init() {
    // 初始化矩阵加法功能
    document.getElementById('function-title').innerText = '矩阵加法';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'block';
    calculateMatrix();
}

function minus_init() {
    // 初始化矩阵减法功能
    document.getElementById('function-title').innerText = '矩阵减法';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'block';
    calculateMatrix();
}

function solve_init() {
    // 初始化矩阵求解功能
    document.getElementById('function-title').innerText = '矩阵求解';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。最后一列将自动设为增广矩阵的右侧向量。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function rref_init() {
    document.getElementById('function-title').innerText = '化简RREF';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function svd_init() {
    document.getElementById('function-title').innerText = '奇异值SVD分解';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function qr_init() {
    document.getElementById('function-title').innerText = 'QR分解';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function d_init() {
    document.getElementById('function-title').innerText = '矩阵的秩';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function norm_init() {
    document.getElementById('function-title').innerText = '矩阵范数';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function LU_init() {
    // 初始化LU分解功能
    document.getElementById('function-title').innerText = 'LU分解';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function cholesky_init() {
    // 初始化Cholesky分解功能
    document.getElementById('function-title').innerText = 'Cholesky分解';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

function eigen_init() {
    // 初始化特征值特征向量功能
    document.getElementById('function-title').innerText = '特征值特征向量';
    document.getElementById('function-detail').innerText = '请粘贴图片或输入二维数组,自动识别矩阵并计算结果。双击图片可关闭。';
    document.getElementById('matrix1-container').style.display = 'block';
    document.getElementById('matrix2-container').style.display = 'none';
    calculateMatrix();
}

document.querySelectorAll('.nav-link').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        this.classList.add('active');
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link !== this) {
                link.classList.remove('active');
            }
        });

        if (this.id == 'option1') {
            function_name = 'multiply';
            multiply_init();
        }
        else if (this.id == 'option2') {
            function_name = 'add';
            add_init();
        }
        else if (this.id == 'option3') {
            function_name = 'minus';
            minus_init();
        }
        else if (this.id == 'option4') {
            function_name = 'inverse';
            inverse_init();
        }
        else if (this.id == 'option5') {
            function_name = 'LU';
            LU_init();
        }
        else if (this.id == 'option6') {
            function_name = 'cholesky';
            cholesky_init();
        }
        else if (this.id == 'option7') {
            function_name = 'solve';
            solve_init();
        }
        else if (this.id == 'option8') {
            function_name = 'rref';
            rref_init();
        }
        else if (this.id == 'option9') {
            function_name = 'svd';
            svd_init();
        }
        else if (this.id == 'option10') {
            function_name = 'qr';
            qr_init();
        }
        else if (this.id == 'option11') {
            function_name = 'd';
            d_init();
        }
        else if (this.id == 'option12') {
            function_name = 'norm';
            norm_init();
        }
        else if (this.id == 'option13') {
            function_name = 'eigen';
            eigen_init();
        }
    });
});

document.querySelector('#matrix1-container').addEventListener('mouseenter', function () {
    // 显示关闭按钮
    document.getElementById('close-matrix1').style.display = 'block';
});

document.querySelector('#matrix1-container').addEventListener('mouseleave', function () {
    // 隐藏关闭按钮
    document.getElementById('close-matrix1').style.display = 'none';
});

document.querySelector('#close-matrix1').addEventListener('click', function () {
    // 清空矩阵1按钮
    closeMatrixImage('matrix1');
});

document.querySelector('#matrix2-container').addEventListener('mouseenter', function () {
    // 显示关闭按钮
    document.getElementById('close-matrix2').style.display = 'block';

});

document.querySelector('#matrix2-container').addEventListener('mouseleave', function () {
    // 隐藏关闭按钮
    document.getElementById('close-matrix2').style.display = 'none';
});

document.querySelector('#close-matrix2').addEventListener('click', function () {
    // 清空矩阵2按钮
    closeMatrixImage('matrix2');
});

document.querySelector('#matrix1').addEventListener('focus', function () {
    // 焦点在矩阵1输入框
    inputarea1Focusing = true;
    inputarea2Focusing = false;
});

document.querySelector('#matrix2').addEventListener('focus', function () {
    // 焦点在矩阵2输入框
    inputarea1Focusing = false;
    inputarea2Focusing = true;
});

document.querySelector('#matrix1').addEventListener('input', function () {
    // 矩阵1输入框内容发生变化
    inputarea1Focusing = true;
    inputarea2Focusing = false;
    if (this.value) {
        saveOri(this.value);
    }
});

document.querySelector('#matrix2').addEventListener('input', function () {
    // 矩阵2输入框内容发生变化
    inputarea1Focusing = false;
    inputarea2Focusing = true;
    if (this.value) {
        saveOri(this.value);
    }
});

document.querySelector('#fractional').addEventListener('click', function () {
    console.log('fractional');
    // 切换到分数显示
    number_type = 'fractional';
    calculateMatrix();
});

document.querySelector('#decimal').addEventListener('click', function () {
    console.log('decimal');
    // 切换到小数显示
    number_type = 'decimal';
    calculateMatrix();
});

function copyToClipboard(text) {
    console.log('复制内容:', text);
    if (navigator.clipboard) { // 使用现代异步剪贴板 API
        navigator.clipboard.writeText(text).then(() => {
            console.log('内容已复制到剪贴板');
            show_warning('内容已复制到剪贴板', 3000);
        }).catch(err => {
            console.error('无法复制内容: ', err);
            show_warning('复制失败', 3000);
        });
    } else { // 为不支持异步剪贴板 API 的浏览器提供后备方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log('内容已复制到剪贴板');
            show_warning('内容已复制到剪贴板', 3000);
        } catch (err) {
            console.error('无法复制内容: ', err);
            show_warning('复制失败', 3000);
        }
        document.body.removeChild(textarea);
    }
}

// 复制 LaTeX 结果
document.getElementById('copy-latex').addEventListener('click', () => {
    copyToClipboard(resultsStorage.latex);
});

// 复制简单结果
document.getElementById('copy-simple-expression').addEventListener('click', () => {
    copyToClipboard(resultsStorage.simple);
});

// 复制完整表达式
document.getElementById('copy-expression').addEventListener('click', () => {
    copyToClipboard(resultsStorage.fullExpression);
});

function closeMatrixImage(targetId) {
    // 获取对应的文本输入框和关闭按钮元素
    let input = document.getElementById(targetId);
    let preview = document.getElementById(targetId + '-preview');

    // 执行与关闭按钮相同的操作
    input.style.display = 'block';
    input.disabled = false;
    preview.style.display = 'none'; // 隐藏图片预览
    preview.src = ''; // 清除图片源，以确保不会再次显示

    // 根据是哪个矩阵，清空相应的全局变量
    if (targetId === 'matrix1') {
        matrix1 = null;
        matrix1_ori = null;
    } else {
        matrix2 = null;
        matrix2_ori = null;
    }
}

function renderResult(latexStr, simpleStr, fullExprStr) {
    // 保存字符串到全局对象
    resultsStorage.latex = latexStr;
    resultsStorage.simple = simpleStr;
    resultsStorage.fullExpression = fullExprStr;
    if (simpleStr !== '') {
        hide_warning();
    }

    // 渲染 LaTeX 字符串
    const container = document.getElementById('result');
    container.innerHTML = fullExprStr;
    MathJax.typesetPromise([container]).catch(function (err) {
        console.error('MathJax render error:', err);
    });
}

function renderMatrixMultiplication(matrix1, matrix2) {
    var latexString = '';
    if (!matrix1 || !matrix2) {
        if (!matrix1 && matrix2) {
            console.log('矩阵1为空');
            latexString = `$$\\text{矩阵1为空} \\times ${matrix2.getLatexString(number_type)}$$`;
        }
        else if (matrix1 && !matrix2) {
            console.log('矩阵2为空');
            latexString = `$$${matrix1.getLatexString(number_type)} \\times \\text{矩阵2为空}$$`;
        }
        else if (!matrix1 && !matrix2) {
            console.log('矩阵1和矩阵2为空');
            latexString = `$$\\text{矩阵1为空} \\times \\text{矩阵2为空}$$`;
        }
        else {
            console.log('矩阵1和矩阵2为空');
            latexString = `$$\\text{矩阵1为空} \\times \\text{矩阵2为空}$$`;
        }
        renderResult('', '', latexString);
    }
    else {
        try {
            result_matrix = matrix1.multiply(matrix2);
            console.log('result_matrix:', result_matrix);
            // 构建矩阵乘法的完整LaTeX表示
            latexString = `$$ ${matrix1.getLatexString(number_type)} \\times ${matrix2.getLatexString(number_type)} = ${result_matrix.getLatexString(number_type)} $$`;
            renderResult(result_matrix.getLatexString(number_type), result_matrix.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('矩阵乘法失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} \\times ${matrix2.getLatexString(number_type)} = \\text{矩阵乘法失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixSolve(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.solve();
            // result is a list of numbers
            console.log('result_matrix:', result);
            // \{ env
            // 构建每个解的LaTeX字符串，使用cases环境
            result_str = result.map((item, index) => {
                return `x_{${index + 1}} = ${item}`;
            }).join(' \\\\ '); // 使用\\\\作为LaTeX中的换行符
            simple_result_str = result.map((item, index) => {
                return `x${index + 1} = ${item}`;
            }).join(' '); // 使用空格作为简单表达式的分隔符
            // 构建矩阵求解的完整LaTeX表示，使用左大括号
            latexString = `$$${matrix1.getAugmentedLatexString()} \\rightarrow \\begin{cases} ${result_str} \\end{cases}$$`;
            renderResult(simple_result_str, result_str, latexString);
            // latexString = `$$  ${result_str} $$`;
        }
        catch (e) {
            console.log('矩阵求解失败:', e);
            latexString = `$$${matrix1.getAugmentedLatexString()} = \\text{矩阵求解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixRREF(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.rref();
            // result is a list of numbers
            console.log('result_matrix:', result);
            latexString = `$$${matrix1.getLatexString(number_type)} \\rightarrow ${result.getLatexString(number_type)} $$`;
            renderResult(result.getSimpleString(), result.getSimpleString(), latexString);
            // latexString = `$$  ${result_str} $$`;
        }
        catch (e) {
            console.log('矩阵求解失败:', e);
            latexString = `$$${matrix1.getAugmentedLatexString()} = \\text{矩阵求解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixSVD(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.svd();
            // result is a list of numbers
            console.log('result_matrix:', result);
            latexString = `$$${matrix1.getLatexString(number_type)} = ${result.U.getLatexString(number_type)} \\times ${result.S.getLatexString(number_type)} \\times ${result.V.getLatexString(number_type)}^T$$`;
            renderResult(result.U.getLatexString(number_type) + "\\n" + result.S.getLatexString(number_type) + "\\n" + result.V.getLatexString(number_type), result.U.getSimpleString() + "\\n" + result.S.getSimpleString() + "\\n" + result.V.getSimpleString(), latexString);
            // latexString = `$$  ${result_str} $$`;
        }
        catch (e) {
            console.log('矩阵求解失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} = \\text{SVD分解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixQR(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.qr();
            // result is a list of numbers
            console.log('result_matrix:', result);
            latexString = `$$${matrix1.getLatexString(number_type)} = ${result.Q.getLatexString(number_type)} \\times ${result.R.getLatexString(number_type)}$$`;
            // latexString = `$$  ${result_str} $$`;
            renderResult(result.Q.getLatexString(number_type) + "\\n" + result.R.getLatexString(number_type), result.Q.getSimpleString() + "\\n" + result.R.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('矩阵求解失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} = \\text{QR分解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixD(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.determinant();
            // result is a list of numbers
            console.log('result_matrix:', result);
            if (number_type == 'fractional') {
                latexString = `$$\\text{det}(${matrix1.getLatexString(number_type)}) = ${math.fraction(result)}$$`;
            } else {
                latexString = `$$\\text{det}(${matrix1.getLatexString(number_type)}) = ${result}$$`;
            }
            renderResult(result, result, latexString);
            // latexString = `$$  ${result_str} $$`;
        }
        catch (e) {
            console.log('矩阵求解失败:', e);
            latexString = `$$\\text{det}(${matrix1.getLatexString(number_type)}) = \\text{求解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixNorm(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.norm();
            // result is a list of numbers
            console.log('result_matrix:', result);
            // latexString = `$$\\|${matrix1.getLatexString(number_type)}\\| = ${result}$$`;
            if (number_type == 'fractional') {
                latexString = `$$\\|${matrix1.getLatexString(number_type)}\\| = ${math.fraction(result)}$$`;
            } else {
                latexString = `$$\\|${matrix1.getLatexString(number_type)}\\| = ${result}$$`;
            }
            renderResult(result, result, latexString);
            // latexString = `$$  ${result_str} $$`;
        }
        catch (e) {
            console.log('矩阵求解失败:', e);
            latexString = `$$\\|${matrix1.getLatexString(number_type)}\\| = \\text{求解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixAdd(matrix1, matrix2) {
    var latexString = '';
    if (!matrix1 || !matrix2) {
        if (!matrix1 && matrix2) {
            console.log('矩阵1为空');
            latexString = `$$\\text{矩阵1为空} + ${matrix2.getLatexString(number_type)}$$`;
        }
        else if (matrix1 && !matrix2) {
            console.log('矩阵2为空');
            latexString = `$$${matrix1.getLatexString(number_type)} + \\text{矩阵2为空}$$`;
        }
        else if (!matrix1 && !matrix2) {
            console.log('矩阵1和矩阵2为空');
            latexString = `$$\\text{矩阵1为空} + \\text{矩阵2为空}$$`;
        }
        else {
            console.log('矩阵1和矩阵2为空');
            latexString = `$$\\text{矩阵1为空} + \\text{矩阵2为空}$$`;
        }
        renderResult('', '', latexString);
    }
    else {
        try {
            result_matrix = matrix1.add(matrix2);
            console.log('result_matrix:', result_matrix);
            // 构建矩阵乘法的完整LaTeX表示
            latexString = `$$ ${matrix1.getLatexString(number_type)} + ${matrix2.getLatexString(number_type)} = ${result_matrix.getLatexString(number_type)} $$`;
            renderResult(result_matrix.getLatexString(number_type), result_matrix.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('矩阵加法失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} + ${matrix2.getLatexString(number_type)} = \\text{矩阵加法失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixMinus(matrix1, matrix2) {
    var latexString = '';
    if (!matrix1 || !matrix2) {
        if (!matrix1 && matrix2) {
            console.log('矩阵1为空');
            latexString = `$$\\text{矩阵1为空} - ${matrix2.getLatexString(number_type)}$$`;
        }
        else if (matrix1 && !matrix2) {
            console.log('矩阵2为空');
            latexString = `$$${matrix1.getLatexString(number_type)} - \\text{矩阵2为空}$$`;
        }
        else if (!matrix1 && !matrix2) {
            console.log('矩阵1和矩阵2为空');
            latexString = `$$\\text{矩阵1为空} - \\text{矩阵2为空}$$`;
        }
        else {
            console.log('矩阵1和矩阵2为空');
            latexString = `$$\\text{矩阵1为空} - \\text{矩阵2为空}$$`;
        }
        renderResult('', '', latexString);
    }
    else {
        try {
            result_matrix = matrix1.subtract(matrix2);
            console.log('result_matrix:', result_matrix);
            // 构建矩阵乘法的完整LaTeX表示
            latexString = `$$ ${matrix1.getLatexString(number_type)} - ${matrix2.getLatexString(number_type)} = ${result_matrix.getLatexString(number_type)} $$`;
            renderResult(result_matrix.getLatexString(number_type), result_matrix.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('矩阵减法失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} - ${matrix2.getLatexString(number_type)} = \\text{矩阵减法失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixInverse(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}^{-1}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result_matrix = matrix1.inverse();
            console.log('result_matrix:', result_matrix);
            // 构建矩阵乘法的完整LaTeX表示
            latexString = `$$ ${matrix1.getLatexString(number_type)}^{-1} = ${result_matrix.getLatexString(number_type)} $$`;
            renderResult(result_matrix.getLatexString(number_type), result_matrix.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('矩阵求逆失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)}^{-1} = \\text{矩阵求逆失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixLU(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.luDecomposition();
            console.log('result:', result);
            l_matrix = result.L;
            u_matrix = result.U;
            // 构建矩阵乘法的完整LaTeX表示
            if (result.P) {
                p_matrix = result.P;
                latexString = `$$${p_matrix.getLatexString(number_type)} \\times ${matrix1.getLatexString(number_type)} \\ =  ${l_matrix.getLatexString(number_type)} \\times ${u_matrix.getLatexString(number_type)}$$`;
            }
            else {
                latexString = `$$${matrix1.getLatexString(number_type)} \\ = ${l_matrix.getLatexString(number_type)} \\times ${u_matrix.getLatexString(number_type)}$$`;
            }
            renderResult(l_matrix.getLatexString(number_type) + "\\n" + u_matrix.getLatexString(number_type), l_matrix.getSimpleString() + "\\n" + u_matrix.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('LU分解失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} = \\text{LU分解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function renderMatrixCholesky(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString)
    }
    else {
        try {
            result = matrix1.choleskyDecomposition();
            console.log('result_matrix:', result);
            const L_matrix = result["L"];
            const U_matrix = result["U"];
            // 构建矩阵乘法的完整LaTeX表示
            latexString = `$$ ${matrix1.getLatexString(number_type)} = ${L_matrix.getLatexString(number_type)} \\times ${U_matrix.getLatexString(number_type)} $$`;
            renderResult(L_matrix.getLatexString(number_type) + "\\n" + U_matrix.getLatexString(number_type), L_matrix.getSimpleString() + "\\n" + U_matrix.getSimpleString(), latexString);
        }
        catch (e) {
            console.log('Cholesky分解失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} = \\text{Cholesky分解失败${e}}$$`;
            renderResult('', '', latexString)
        }
    }
}

function renderMatrixEigen(matrix1) {
    var latexString = '';
    if (!matrix1) {
        console.log('矩阵1为空');
        latexString = `$$\\text{矩阵1为空}$$`;
        renderResult('', '', latexString);
    }
    else {
        try {
            result = matrix1.eigenvectors();
            console.log('result_matrix:', result);
            const eigenvalues = result.eigenvalues;
            const eigenvectors = result.eigenvectors;
            // 构建矩阵乘法的完整LaTeX表示
            latexString = `$$ ${matrix1.getLatexString(number_type)} = ${eigenvectors.getLatexString(number_type)} \\times ${new Matrix(math.fraction(math.diag(eigenvalues))).getLatexString(number_type)} $$`;
            renderResult(eigenvectors.getSimpleString() + "\\n" + new Matrix(math.fraction(math.diag(eigenvalues))).getLatexString(number_type), eigenvectors.getSimpleString() + "\\n" + new Matrix(math.fraction(math.diag(eigenvalues))).getSimpleString(), latexString);
        }
        catch (e) {
            console.log('特征值分解失败:', e);
            latexString = `$$${matrix1.getLatexString(number_type)} = \\text{特征值分解失败${e}}$$`;
            renderResult('', '', latexString);
        }
    }
}

function calculateMatrix() {
    if (function_name == 'multiply') {
        if (!matrix1 || !matrix2) {
            console.log('矩阵1或矩阵2为空');
        }
        renderMatrixMultiplication(matrix1, matrix2);
    }
    else if (function_name == 'inverse') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixInverse(matrix1);
    }
    else if (function_name == 'add') {
        if (!matrix1 || !matrix2) {
            console.log('矩阵1或矩阵2为空');
        }
        renderMatrixAdd(matrix1, matrix2);
    }
    else if (function_name == 'minus') {
        if (!matrix1 || !matrix2) {
            console.log('矩阵1或矩阵2为空');
        }
        renderMatrixMinus(matrix1, matrix2);
    }
    else if (function_name == 'LU') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixLU(matrix1);
    }
    else if (function_name == 'cholesky') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixCholesky(matrix1);
    }
    else if (function_name == 'solve') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixSolve(matrix1);
    }
    else if (function_name == 'rref') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixRREF(matrix1);
    }
    else if (function_name == 'svd') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixSVD(matrix1);
    }
    else if (function_name == 'qr') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixQR(matrix1);
    }
    else if (function_name == 'd') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixD(matrix1);
    }
    else if (function_name == 'norm') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixNorm(matrix1);
    } else if (function_name == 'eigen') {
        if (!matrix1) {
            console.log('矩阵1为空');
        }
        renderMatrixEigen(matrix1);
    }

}

// 功能：双击图片则关闭图片
function setupDoubleClickToCloseImage() {
    // 为每个图片预览元素添加双击关闭功能
    document.querySelectorAll('.matrix-preview').forEach(preview => {
        preview.addEventListener('dblclick', function () {
            // 根据图片元素的 ID 确定是哪个矩阵的预览被双击
            let targetId = this.id.includes('matrix1') ? 'matrix1' : 'matrix2';

            closeMatrixImage(targetId);
        });
    });
}


function autoHeight() {
    const func = function (e) {
        // Set the height of the textarea to the height of its content
        if (this.value.indexOf("\n") != -1) {
            var lines = this.value.split("\n")
            var linesCount = lines.length
        }
        else {
            var linesCount = 1
        }
        if (linesCount > 2) {
            this.style.height = (linesCount * 1.5) + "em"
        }
        else {
            this.style.height = "3em"
        }
    }
    document.getElementById('matrix1').addEventListener('input', func);
    document.getElementById('matrix2').addEventListener('input', func);
}



// 在页面加载完毕后调用此函数以设置事件监听器
document.addEventListener('DOMContentLoaded', setupDoubleClickToCloseImage);
document.addEventListener('DOMContentLoaded', autoHeight);