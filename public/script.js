console.log('you got the js');
let users = [];
const output = $("#output");
const first = $("#first");
const last =  $("#last");
const email = $("#email");
const age = $("#age");

const message = (msg) => {
    let box = $("#snackbar");

    box.html(msg);

    box.addClass("show");

    setTimeout(function () {
        box.removeClass("show");
    }, 1000);
};

const buildTemplate = (user) => {
    return `<li class="list-group-item">
				<div>
					<div id="user_${user.id}" class="flex-row">
						<input class="first" type="text"  value="${user.first}">
						<input class="last" type="text"  value="${user.last}">
						<input class="email" type="email" value="${user.email}">
						<input class="age" type="number" value="${user.age}">

						<button onclick="updateUser($(this).parent())" class="btn btn-secondary">Update</button>
						<button type="button" onclick="deleteUser($(this).parent())" class="btn btn-danger">Delete</button>
					</div>
				</div>
             </li>`;
};

const displayUsers = (data) => {
    output.empty();
    data.forEach((data) => {
        output.append(buildTemplate(data));
    });
};

const getUsers = () => {
    fetch("/api/users").then((res) => res.json())
        .then((res) => {
            users = res;
            displayUsers(res)
        });
};

getUsers();

const resetUserInputs = () => {
    first.val('');
    last.val('');
    email.val('');
    age.val('');
};

const newUser = (e) => {
    e.preventDefault();
    let status ;

    if ( first.val() === '' || last.val() === '' || email.val() === '' || age.val() == 0){
        message(`Invalid user input`);
    } else {
        fetch('/api/newuser', {
            method: 'post',
            body: JSON.stringify({
                first: first.val(),
                last: last.val(),
                email: email.val(),
                age: age.val()
            }),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((res) => {
            if ( res.status === 200 ) {
                message('New User added');
                getUsers();
            } else {
                message(`Error: couldn't add user`);
            }
            resetUserInputs();
        });
    }
};

const updateUser = (user) => {
    let userID = user.attr("id").substring(5);
    let first = user.find('.first').val();
    let last = user.find('.last').val();
    let email = user.find('.email').val();
    let age = user.find('.age').val();

    if ( first === '' || last === '' || email === '' || age == 0){
        message(`Invalid user`);
    } else {
        fetch(`/api/${userID}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                first: first || '',
                last: last || '',
                email: email || '',
                age: age || 0
            })
        }).then((res) => {
            return res.json();
        }).then((res) => {
            if ( res === 'success' ) {
                message('User updated');
                getUsers();
            } else {
                message(`Error: couldn't update user`);

            }
        });
    }
};

const deleteUser = (user) => {
    let userID = user.attr("id").substring(5);

    fetch(`/api/${userID}`, {
        method: "delete"
    }).then((response) => {
        return response.json();
    }).then((res) => {
        getUsers();
        if ( res.status === 200 ) {
            message('New User added');
            getUsers();
        } else {
            message(`Error: couldn't update user`);
        }
    });
};

const aToZ = function (e) {
    e.preventDefault();

    users.sort((a, b) => (a.last.toLowerCase() > b.last.toLowerCase()) ? 1 : (a.last.toLowerCase() === b.last.toLowerCase()) ? ((a.age > b.age) ? 1 : -1) : -1);

    output.empty();
    displayUsers(users);
};


const zToA = function (e) {
    e.preventDefault();

    users.sort((a, b) => (a.last.toLowerCase() < b.last.toLowerCase()) ? 1 : (a.last.toLowerCase() === b.last.toLowerCase()) ? ((a.age < b.age) ? 1 : -1) : -1);

    output.empty();
    displayUsers(users);
};


const filter = (e, input) => {
    e.preventDefault();

    let array = users.filter(user => user.last.toLowerCase().includes(input.toLowerCase()));

    output.empty();
    displayUsers(array);

};
