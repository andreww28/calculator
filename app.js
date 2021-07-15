//Global variables
let nums = [];
let number_click = false;
let off = true;
let first_num = '';
let operator = '';
let click_input_btn = '';

const input_field_parent = document.getElementById("input");
const input_field = document.getElementById("input-field");
const solution = document.getElementById("solution");
const audio = new Audio('click.wav');
const maximum_num_input = 14;

//Operations
const operations = {
    add : (a,b) => a + b,
    subtract : (a,b) => a - b,
    multiply : (a,b) => a * b,
    divide : (a,b) => a / b,
    toPercent : a => a / 100,  
    squared: a => a ** 2,
    power: (a,b) => a ** b,
    square_root: a => a ** (1/2),
    factorial: a => (Number.isInteger(a)) ? Math.round(factorial(a)) : factorial(a),
};


//Operations function
function operate(a,b){
    a = parseFloat(a);
    b = parseFloat(b);

    switch(operator){
        case '+':
            return operations.add(a,b);
        case '-':
            return operations.subtract(a,b);
        case 'x':
            return operations.multiply(a,b);
        case '/':
            return operations.divide(a,b);
    }
}

function gamma(n) {  // accurate to about 15 decimal places
    //some magic constants
    var g = 7, // g represents the precision desired, p is the values of p[i] to plug into Lanczos' formula
        p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if(n < 0.5) {
        return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n);
    }
    else {
        n--;
        var x = p[0];
        for(var i = 1; i < g + 2; i++) {
        x += p[i] / (n + i);
        }
        var t = n + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (n + 0.5)) * Math.exp(-t) * x;
    }
}

function factorial(n) {
    if(n < 0){
        alert("Negative factorial not supported!");
        reset();
        return '';
    }
    return gamma(n + 1);
}

function square_root_func(){
    let input_text = input_field.textContent;
    let first_num_sol = solution.textContent.split(/[\+\-\/x]/)[1];
    let index;

    if(input_text == '0') return;
    (first_num_sol ==='') ? index = 0 : index = 1;
    
    if(operator != ''){
        display_solution(`${solution.textContent.split(/[\+\-\/x]/)[index]} ${operator} √${input_text}`);
    }else{
        display_solution(`√${input_text}`);
    }

    display_input(fixed_result(operations.square_root(input_text)));
    number_click = true;
}

function power(){
    let input = input_field.textContent.split('^');
    return operations.power(parseFloat(input[0]), parseFloat(input[1]));
}


function append_special_operator(symbol){
    let special_operator_present = /[%^!]/.test(input_field.textContent);

    if(special_operator_present === false){
        click_input_btn =  input_field.textContent;
        display_clicked_btn(symbol);
    }
    click_input_btn = '';
}

function special_operation(){
    special_operator = input_field.textContent.slice(-1);
    number_click = true;
    
    if(input_field.textContent.length != 0){
        if(special_operator == '%'){
            return operations.toPercent(parseFloat(input_field.textContent));
        }else if(special_operator == '!'){
            return operations.factorial(parseFloat(input_field.textContent));
        }else if(/\^/.test(input_field.textContent)){
            return power();
        }else{
            return '';
        }
    }
}

function fixed_result(num){
    if(/\./.test(num)){
        if(num >= 14){
            return num.toExponential(4);
        } 
    }
    return Math.round(num * 100000000) / 100000000;
}


//Display
function turn_off_calculator(){
    input_field.textContent = '';
    solution.textContent = '';
    input_field_parent.style.backgroundColor = "#0a0c0a";
    off=true;
}

function display_input(text_input){
    if(!off){
        input_field.textContent = text_input;
    }
}

function display_solution(text_input){
    if(!off){
        solution.textContent = text_input;
    }
}

function display_clicked_btn(chr){
    if(input_field.textContent.length -1 >= maximum_num_input){
        alert(`Maximum number(${maximum_num_input + 1}) reached!`);
        return;
    }

    click_input_btn += chr;
    display_input(click_input_btn);
}

function check_input_error(){
    let input_text = input_field.textContent;
    if(input_text.includes('ERROR')){
        reset();
    }
    if(input_text === "NaN" || input_text === "Infinity"){
        reset();
        display_input('ERROR');
    }
}


//Buttons functions
function append_num_input(text){
    if((text === "0" && input_field.textContent === '0') || /[!%]/.test(input_field.textContent)) return;

    display_clicked_btn(text);
    if(input_field.textContent.length - 1 <= maximum_num_input){
        number_click = true;
    }
}


function append_dot_input(text){
    let has_point = /\./.test(input_field.textContent);

    if(/[!%^]/.test(input_field.textContent)) return;

    if(!has_point){
        display_clicked_btn(text);
    }
}


function operation_calculate(symbol){
    if(/[!%^]/.test(input_field.textContent)){
        display_input(fixed_result(special_operation()));
    }

    if(!number_click || input_field.textContent == 'ERROR'){
            return;
    }

    first_num = input_field.textContent;
    nums.push(first_num)


    if(nums.length == 2){
        display_input(fixed_result(operate(nums[0], nums[1])));
        nums.splice(0, 2);
        nums.push(input_field.textContent);
    }

    operator = symbol;
    click_input_btn  = '';
    number_click = false;

    if(nums[1] == undefined){
        display_solution(`${nums[0]} ${operator}`);
        //input_field.textContent = '';
    }else if(nums[1] != undefined){
        display_solution(`${nums[0]} ${operator} ${nums[1]}`);
    }
}


function equal_function(){
    let first_operand = nums[0];
    display_solution('');

    if(/[!%^]/.test(input_field.textContent)){
        display_solution(input_field.textContent);
        display_input(fixed_result(special_operation()));
    }

    if(first_operand != undefined && input_field.textContent != ''){
        display_solution(`${first_operand} ${operator} ${input_field.textContent}`);
        display_input(fixed_result(operate(first_operand, input_field.textContent)));
        click_input_btn = '';
        nums.splice(0,2);
    }
}

function to_pos_or_neg(){
    let input_text = input_field.textContent;

    if(/\-/.test(input_text)){
        input_field.textContent = input_text.replace('-', '');
    }else{
        input_field.textContent = input_text.replace(/^/, '-');
    }
}


function reset(){
    off=false;
    input_field_parent.style.backgroundColor = "#293D30";

    solution.textContent = '';
    input_field.textContent = '0';
    nums = [];
    operator = '';
    click_input_btn = '';
    number_click = false;
}


function delete_last_input(){
    let input_length = input_field.textContent.length;

    if(input_length - 1 === 0 || input_field.textContent == 'ERROR'){
        reset();
    }  
    
    if(input_length >= 1){
        let cut_input_string = input_field.textContent.substring(0, input_length - 1);
        click_input_btn = cut_input_string;
        number_click = true;

        display_input(click_input_btn);       
    }
}


function call_button_function(text){
    audio.play();

    switch(text){
        case (text.match(/^\d$/) || {}).input:
            append_num_input(text);
            break;
        
        case '.':
            append_dot_input(text);
            break;

        case (text.match(/^[x\-\/\+]$/) || {}).input:
            operation_calculate(text);
            break;

        case '=':
            equal_function();
            break;

        case 'AC':
            reset();
            break;

        case 'C':
            delete_last_input();
            break;

        case '+/-':
            to_pos_or_neg();
            break;

        case '%':
            append_special_operator('%');
            break;

        case 'x!':
            append_special_operator('!');
            break;

        case 'x2':
            append_special_operator('^2');
            break;

        case 'xy':
            append_special_operator('^');
            break;

        case '√':
            square_root_func();
            break;

        case 'OFF':
            turn_off_calculator();
            break;  
    }
    check_input_error();
}

function add_button_event(){
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.addEventListener('click', call_button_function.bind(event, button.textContent),false));
}

function start(){
    turn_off_calculator();
    add_button_event(); 
}

start();


