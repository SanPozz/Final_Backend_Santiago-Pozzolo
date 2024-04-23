document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    const buttonMessage = document.getElementById("button-send-message");
    const inputMessage = document.getElementById("input-message");
    const divMessages = document.getElementById("messages-container");

    let email;
    socket.emit('loadMessages')

    Swal.fire({
        title: "User Sign-In",
        text: "Insert your email please",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Validate",
        showLoaderOnConfirm: true,
        preConfirm: (email) => {
            if (emailValidator(email)) {
                return email
            } else {
                Swal.showValidationMessage("Email isn`t valid")
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Email is valid!",
                icon: "success"
            })
            email = result.value
        }
    })

    function emailValidator(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isValid = regex.test(email)

        if (isValid) {
            return true
        } else {
            return false
        }
    }

    buttonMessage.addEventListener('click', () => {
        if (inputMessage.value.trim().length > 0) {
            socket.emit('sentMessage', {
                userEmail: email,
                message: inputMessage.value
            })
            inputMessage.value = '';
        }
    })

    socket.on('messages', arrayMessages => {
        divMessages.innerHTML = "";
        arrayMessages.forEach(info => {
            const { userEmail, message } = info
            divMessages.innerHTML += `
            <div>
                <p class="message" >${userEmail}: ${message}</p>
            </div>`
        });
    })
}
)