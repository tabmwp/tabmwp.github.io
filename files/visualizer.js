let display_num = 10;

// Variables for the filter
let grades = ['all', 1, 2, 3, 4, 5, 6, 7, 8];
let tasks = ["all", "multi_choice", "free_text"]
let answers = ["all", "integer_number", "decimal_number", "extractive_text", "boolean_text", "other_text"]
let has_title = ['both', 'yes', 'no'];
let row_num = ['all', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
let column_num = ['all', 2, 3, 4, 5, 6]

// Elements in the Option Panel
let optbtn = document.getElementsByClassName("optionsbtn")[0];
let optionpanel = document.getElementById("option-panel");
let closebtn = document.getElementsByClassName("closebtn")[0];
let optboxes = document.getElementsByClassName("optbox");
let opt_dds = document.getElementsByClassName("opt-dd");
let filter_submit = document.getElementById("filter-submit");

// Element Text the Option Panel
let task_dd = make_dropdown("Choose a question type", tasks, "task-dd");
let answer_dd = make_dropdown("Choose a answer type", answers, "answer-dd");
let grade_dd = make_dropdown("Choose a grade:", grades, "grade-dd");
let row_num_dd = make_dropdown("Choose # of rows of a table", row_num, "row_num-dd");
let column_num_dd = make_dropdown("Choose # of columns of a table", column_num, "column_num-dd");
let has_title_dd = make_dropdown("Table with a title?", has_title, "has_title-dd");

// Content in the Option Box
optboxes[0].innerHTML += task_dd;
optboxes[0].innerHTML += answer_dd;
optboxes[0].innerHTML += grade_dd;
optboxes[0].innerHTML += row_num_dd;
optboxes[0].innerHTML += column_num_dd;
optboxes[0].innerHTML += has_title_dd;

// Elements in the Content Body
let display = document.getElementById("display");
let body = document.getElementById("content-body");

// Click actions for the option buttons
optbtn.addEventListener("click", openNav);
closebtn.addEventListener("click", closeNav);

// Set up the data filters and display the page
let filters = {};

for (each of opt_dds) {
    each.addEventListener("change", change_filters);
}

// Display the page when clicking the fresh button
filter_submit.addEventListener("click", display_data);

// Display the page when it is running at the first time
display_data();


// Functions
function openNav() {
    optionpanel.style.width = "20vw";
    display.style.width = "60vw";
    for (each of optionpanel.children) {
        each.style.display = "block";
    }
}

function closeNav() {
    optionpanel.style.width = "0";
    display.style.width = "80vw";
    for (each of optionpanel.children) {
        each.style.display = "none";
    }
}

// Function: update the filter values
function change_filters(e) {
    filters.grade = document.getElementById("grade-dd").value;
    filters.task = document.getElementById("task-dd").value;
    filters.answer = document.getElementById("answer-dd").value;
    filters.row_num = document.getElementById("row_num-dd").value;
    filters.column_num = document.getElementById("column_num-dd").value;
    filters.has_title = document.getElementById("has_title-dd").value;
}

// Function: draw the page
function create_page(d) {
    if (d.length === 0) {
        body.innerHTML = "<p>No example satisfies all the filters.</p>";
    } else {
        col1 = create_col(d.slice(0, d.length / 2));
        col2 = create_col(d.slice(d.length / 2));
        body.innerHTML = col1 + col2;
    }
    reflow(body);
    console.log("reflowed");
}

function create_col(data) {
    res = [];
    for (each of data) {
        res.push(create_example(each));
    }
    return `<div class="display-col"> ${res.join("")} </div>`;
}

// data is an object with several attributes.
function create_example(data) {
    let pid = make_pid(data.split, data.pid);
    let question = make_qt(data.question, data.unit);

    let tab_img = make_img(data.path, data.pid);
    let tab_title = make_title(data.table_title);
    let tab_txt = make_txt(data.table);

    let choices = make_choices(data.choices);
    let answer = make_answer(data.answer);
    let solution = make_solution(data.solution);

    html = make_box([tab_img, tab_title, tab_txt, question, choices, answer, solution, pid]) + "<hr/>";

    return html;
}

// creates a div with question text in it
function make_pid(split, pid) {
    let html = `
            <p> 
                <b>ID:</b>
                <a class="pid">${split}/${pid}</a>
            </p> 
    `;
    return html;
}

function make_qt(question, unit) {
    let html = "";
    if (unit === null)
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">${question}</p>
        `;
    else
        html = `
                <p><b>Question </b></p>
                <p class="question-txt">${question} (unit: ${unit})</p>
        `;
    return html;
}

function make_img(path, pid) {
    path = [path, "tables", pid + ".png"].join("/")
    // console.log(path)
    let html = `
            <p><b>Table Image </b></p>
            <img src="${path}" alt="example image" class="question-img" />
    `;
    return html;
}

function make_sol_img(path, pid) {
    path = [path, "raw_data", pid, "solution.png"].join("/")
    let html = `
            <img src="${path}" alt="example image" class="solution-img" />
    `;
    return html;
}

function make_title(title) {
    if (title === null)
        return "";
    let html = `
            <p>
                <b>Table Title:</b> 
                <a class="tabel-title"> ${title}</a>
            </p>
    `;
    return html;
}

function make_txt(text) {
    if (text === null)
        return "";
    let html = `
            <p><b>Table Text</b></p>
            <p class="table-txt">${text}</p>
    `;
    return html;
}

function make_choices(choices) {
    if (choices === null) return "";

    let temp = "";
    let len = 0;
    for (each of choices) {
        let html = make_choice(each);
        temp += html;
        len += each.length;
    }
    let html = "";
    if (len < 60)
        html = `
                <p><b>Choices </b></p>
                <div class="choices">${temp}</div>
        `;
    else
        html = `
                <p><b>Choices </b></p>
                <div class="choices-vertical">${temp}</div>
        `;
    return html;
}
function make_choice(choice) {
    let html = `
            <div class="choice-txt">${choice}</div>
    `;
    return html;
}

function make_answer(answer) {
    let html = `
                <p>
                    <b>Answer: </b>
                    <a class="answer-txt">${answer}</a>
                </p>
    `;
    return html;
}

function make_solution(solution) {
    if (solution === null)
        return "";
    let html = `
            <p><b>Solution </b></p>
            <p class="solution-txt">${solution}</p>
    `;
    return html;
}

function make_box(contents, cls = "") {
    if (contents.join("").length === 0)
        return "";
    let html = `
        <div class="box ${cls}"> 
            ${contents.join(" ")}
        </div>
    `;
    return html;
}

function make_dropdown(label, options, id, default_ind = 0) {
    // make_dropdown("Choose a topic:", topics, "topic-dd");
    let html = "";
    for (let i = 0; i < options.length; i++) {
        if (i === default_ind)
            html += `<option value="${options[i]}" selected> ${options[i]} </option>`;
        else
            html += `<option value="${options[i]}"> ${options[i]} </option>`;
    }
    html = `<label class="dd-label">${label} <select id="${id}" class="opt-dd"> ${html} </select> </label><br/>`;
    return html;
}

// Main Functions
function display_data() {
    // set up or update the filter
    change_filters();

    // load the data
    res = problem_data;

    if (filters.grade !== "all") {
        res = res.filter(e => e.grade.toString() === filters.grade);
    }

    if (filters.task !== "all") {
        res = res.filter(e => e.ques_type === filters.task);
    }

    if (filters.answer !== "all") {
        res = res.filter(e => e.ans_type === filters.answer);
    }

    if (filters.row_num !== "all") {
        res = res.filter(e => e.row_num.toString() === filters.row_num);
    }

    if (filters.column_num !== "all") {
        res = res.filter(e => e.column_num.toString() === filters.column_num);
    }

    if (filters.has_title !== "both") {
        res = res.filter((e) => {
            if (filters.has_title === "yes")
                return e.table_title !== null;
            else
                return e.table_title === null;
        });
    }

    d = _.sample(res, Math.min(display_num, res.length));
    for (each of d) {
        console.log(d);
    }
    create_page(d);
}

// force the browser to reflow
function reflow(elt) {
    elt.offsetHeight;
}
