document.addEventListener('DOMContentLoaded', loadProfile);

function loadProfile() {
  const userData = JSON.parse(localStorage.getItem('data'));

  if (userData) {
    document.getElementById('profile-email').innerText = userData.email;
    document.getElementById('profile-firstname').innerText = userData.firstname;
    document.getElementById('profile-lastname').innerText = userData.lastname;
    document.getElementById('profile-phone').innerText = userData.phone;
    document.getElementById('profile-situation').innerText = userData.situation;
  } else {
    alert('No user data found!');
  }
}

function logout() {
  localStorage.removeItem('data');
  window.location.href = 'https://assistante-mae.onrender.com/login_signup/login_signup.html';
}

function updateProfile() {
  const email = prompt("Enter new email:", document.getElementById('profile-email').innerText);
  const firstname = prompt("Enter new first name:", document.getElementById('profile-firstname').innerText);
  const lastname = prompt("Enter new last name:", document.getElementById('profile-lastname').innerText);
  const phone = prompt("Enter new phone:", document.getElementById('profile-phone').innerText);
  const situation = prompt("Enter new situation:", document.getElementById('profile-situation').innerText);

  if (email && firstname && lastname && phone && situation) {
    const updatedData = {
      email,
      firstname,
      lastname,
      phone,
      situation
    };

    // Save the updated data to localStorage
    localStorage.setItem('data', JSON.stringify(updatedData));

    // Refresh the profile display
    loadProfile();
  } else {
    alert('All fields are required to update the profile!');
  }
}
