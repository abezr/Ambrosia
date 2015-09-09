function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function validatePseudo(pseudo) {
    var re = /^[a-z]{2,8}$/i;
    return re.test(pseudo);
}
function validatePassword(password) {
    var re = /^(?=.*\d)[a-zA-Z0-9]{8,}$/i;
    return re.test(password);
}
function matchPassword(password1, password2) {
    console.log(password1.match(password2), password1, password2);
    return password1.match(password2);
}
function catchSignupDetails(details) {
    var errors = {};
    validateEmail(details.mail) ? errors.email = null : errors.email = 'your email address is not valid';
    validatePassword(details.password) ? errors.password = null : errors.password = 'your password should contain letters and numbers and contain at least 8 caracters';
    matchPassword(details.password, details.confirmPassword) ? errors.match = null : errors.match = 'this is not the same as above';
    if (errors.email || errors.password || errors.match) {
        details.errors = errors;
        return details;
    }
    return true;
}
function catchLoginDetails(details) {
    var errors = {};
    validateEmail(details.pseudo) ? errors.pseudo = null : errors.pseudo = 'your pseudo should take between 2 and 10 caracters';
    validatePassword(details.password) ? errors.password = null : errors.password = 'unvalid password';
    if(errors.pseudo || errors.password) {
      details.errors = errors;
      return details;
    }
    return true;
}
var Validate = function (details) {
  return details.form === 'signup' ? catchSignupDetails(details) : catchLoginDetails(details);
};

export default Validate;
