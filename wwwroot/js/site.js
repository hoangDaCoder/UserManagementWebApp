// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener('DOMContentLoaded', function () {
    //Add new user
    const saveUserBtn = document.getElementById('saveUserBtn');
    if (!saveUserBtn) return;
    saveUserBtn.addEventListener('click', async function () {
        const user = {
            Id: 0,
            Name: document.getElementById('name').value,
            DateOfBirth: document.getElementById('dob').value,
            Email: document.getElementById('email').value,
            PhoneNumber: document.getElementById('phone').value,
            Address: document.getElementById('address').value
        };

        console.log("New user:", user);

        try {
            const response = await fetch('/Home/AddUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const result = await response.json();
            if (result.success) {
                alert(result.message);
                location.reload();
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error('Lỗi thêm người dùng: ', error);
            alert("Đã xảy ra lôi khi thêm người dùng mới! \r Vui lòng kiểm tra console!")
        }

        // Close modal
        const modalEl = document.getElementById('addUserModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        document.activeElement.blur();

        // Clear form
        document.getElementById('addUserForm').reset();
    });

    //Select all user's checkbox
    const selectAll = document.getElementById("selectAll");
    if (!selectAll) return;
    selectAll.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll(".select-user");
        checkboxes.forEach(cb => cb.checked = this.checked);
    });

    //Delete all checked-user
    const deleteBtn = document.getElementById('deleteBtn');
    if (!deleteBtn) return;
    deleteBtn.addEventListener('click', async function () {
        const selectedCheckboxes = Array.from(document.querySelectorAll('.select-user')).filter(cb => cb.checked);
        if (selectedCheckboxes.length == 0) {
            alert("Vui lòng chọn user để xóa!");
            return;
        }

        const Ids = selectedCheckboxes.map(cb => parseInt(cb.getAttribute('data-id'), 10));
        if (!confirm(`Bạn có chắc chắn muốn xóa ${Ids.length} người dùng?`)) return;

        try {
            const respone = await fetch('Home/DeleteUsers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Ids })
            });

            const result = await respone.json();
            if (result.success) {
                alert(result.message);
                location.reload();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Lỗi xóa người dùng: ", error)
            alert("Đã xảy ra lỗi khi xóa người dùng! \r Vui lòng kiểm tra console!")
        }
    });

    //Modify one user info at a time
    const modifyBtn = document.getElementById('modifyBtn');
    if (!modifyBtn) return;
    modifyBtn.addEventListener('click', function () {
        const selectedUser = Array.from(document.querySelectorAll('.select-user')).filter(cb => cb.checked);
        if (selectedUser.length == 0) {
            alert("Chọn 1 user để sửa!");
            return;
        } else if (selectedUser.length > 1) {
            alert("Chỉ chọn 1 user để sửa mỗi lần!");
            return;
        }
        const row = selectedUser[0].closest('tr');
        const id = row.querySelector('td:nth-child(2)').textContent.trim();
        const name = row.querySelector('td:nth-child(3)').textContent.trim();
        const dob = row.querySelector('td:nth-child(4)').textContent.trim();
        const email = row.querySelector('td:nth-child(5)').textContent.trim();
        const phone = row.querySelector('td:nth-child(6)').textContent.trim();
        const address = row.querySelector('td:nth-child(7)').textContent.trim();

        // Fill modal fields
        document.getElementById('editId').value = id;
        document.getElementById('editName').value = name;
        document.getElementById('editDob').value = dob;
        document.getElementById('editEmail').value = email;
        document.getElementById('editPhone').value = phone;
        document.getElementById('editAddress').value = address;

        // Show modal
        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();
    });

    //Save new user's info
    const saveEditBtn = document.getElementById('saveEditBtn')
    if (!saveEditBtn) return;
    saveEditBtn.addEventListener('click', async function () {
        const user = {
            Id: parseInt(document.getElementById('editId').value),
            Name: document.getElementById('editName').value,
            DateOfBirth: document.getElementById('editDob').value,
            Email: document.getElementById('editEmail').value,
            PhoneNumber: document.getElementById('editPhone').value,
            Address: document.getElementById('editAddress').value
        };

        try {
            const respone = await fetch('Home/UpdateUser', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            const result = await respone.json();
            if (result.success) {
                alert(result.message);
                location.reload();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Lỗi khi sửa thông tin người dùng: ", error)
            alert("Đã xảy ra lỗi khi sửa thông tin người dùng! \r Vui lòng kiểm tra console!")
        }
    });

    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.querySelector("input[placeholder='Tìm kiếm...']");
    const table = document.getElementById("userTable");
    const rows = table.querySelectorAll("tbody tr");

    if (!searchBtn || !searchInput) return;

    searchBtn.addEventListener("click", function (event) {
        event.preventDefault(); // stop the form from reloading the page
        const keyword = searchInput.value.toLowerCase().trim();

        rows.forEach(row => {
            const cellsText = row.textContent.toLowerCase();
            if (cellsText.includes(keyword)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});