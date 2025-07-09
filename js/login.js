import supabase from './supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';

        const email = event.target.email.value;
        const password = event.target.password.value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Erro no login:', error);
            errorMessage.textContent = 'Email ou senha inválidos.';
            return;
        }

        if (data.user) {
            window.location.href = 'admin.html'; // Redireciona para a página de admin
        }
    });
});