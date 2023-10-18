import { _onHidePassword, setErrorMessage, isFormContainsError, validateInputValue, postRequest, loginCheck } from './functions.js';
import { form } from './tags.js';
import { passwordReg } from './validationRegExp.js';

loginCheck();

const signupButton = document.querySelector('#signup-button');
const hidePasswordCheckButton = document.querySelector('.hide-password-check');

form.addEventListener('focusout', _onValidateSignupInputValue);
signupButton.addEventListener('click', _onSignup);
form.addEventListener('keydown',_onEnterSignup);
hidePasswordCheckButton.addEventListener('click', _onHidePassword);

/**
 * 유효성검사 후, signup함수를 호출한다.
 */
function _onSignup(){
    validateAll();
    signup();
}

/**
 * 에러여부 확인 후, 회원가입한다.
 */
function signup(){
    if(!isFormContainsError()) {
        const email = document.querySelector('#email');
        const password = document.querySelector('#password');

        const account = {
            email: email.value,
            password: password.value,
        }

        postRequest('sign-up', account)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(() => {
                // 경로 이동
                location.href = "/pages/folder";
            })

    }
}

/**
 * form에서 엔터키를 누를 경우 유효성검사 후, signup함수를 호출한다.
 */
function _onEnterSignup(e){
    if(e.key === 'Enter'){
        _onSignup();
    }
}

/**
 * form 전체 input의 유효성검사를 한다.
 */
function validateAll(){
    const inputs = document.querySelectorAll('.form-item input');

    for(const input of inputs){
        validateInputValue(input.id, input.value);
        validateSingupInputValue(input.id, input.value);
    }
}

/**
 * 회원가입시 필요한 validateSingupInputValue 함수를 호출한다.
 */
function _onValidateSignupInputValue(e){
    const id = e.target.id;
    const value = e.target.value;
    validateSingupInputValue(id, value);
}

/**
 * 회원가입시 필요한 validation을 실행한다.
 * @param {string} type target dom의 id
 * @param {string} value target dom의 value
 */
function validateSingupInputValue(type, value){
    if(type === 'email'){
        // 중복된 이메일인지 체크
        postRequest('check-email', { email: value })
            .then((response) => {
                if(!response.ok){
                    setErrorMessage(type, 'duplicate');
                }
            })

    } else if(type === 'password'){
        if(passwordReg.test(value) === false){
            setErrorMessage(type, 'validation');
        }

    } else if(type === 'passwordCheck') {
        // 비밀번호가 일치하는지 체크
        const passwordCheck = document.querySelector('#passwordCheck');
        const password = document.querySelector('#password');

        if (password.value !== passwordCheck.value) {
            setErrorMessage('passwordCheck', 'coincidence');
        }
    }
}