import supabase from './supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
    loadPageImages();
    checkAdminStatus();
});

async function loadPageImages() {
    const { data: images, error } = await supabase.rpc('get_all_images');

    if (error) {
        console.error('Erro ao carregar imagens da página:', error);
        return;
    }

    // 1. Carregar Imagem do Topo (Hero)
    const heroImage = images.find(img => img.section === 'Topo');
    if (heroImage) {
        const heroSection = document.getElementById('hero-section');
        heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage.image_url})`;
    }

    // 2. Carregar Imagem "Sobre Mim"
    const aboutImage = images.find(img => img.section === 'Sobre Mim');
    if (aboutImage) {
        const aboutContainer = document.getElementById('about-image-container');
        aboutContainer.innerHTML = `<img src="${aboutImage.image_url}" alt="${aboutImage.title}" class="profile-pic">`;
    }

    // 3. Carregar Galeria de "Serviços"
    const servicesImages = images.filter(img => img.section === 'Serviços');
    const servicesGallery = document.getElementById('services-gallery');
    servicesGallery.innerHTML = ''; // Limpa a área

    if (servicesImages.length > 0) {
        servicesImages.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${image.image_url}" alt="${image.title}">
                <h3>${image.title}</h3>
                <p>${image.description || ''}</p>
            `;
            servicesGallery.appendChild(card);
        });
    } else {
        servicesGallery.innerHTML = '<p>Nenhum serviço cadastrado no momento.</p>';
    }
}

// 4. Verificar Status do Administrador
async function checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // Criar indicador de admin logado
        const adminIndicator = document.createElement('div');
        adminIndicator.id = 'admin-indicator';
        adminIndicator.className = 'admin-indicator';
        adminIndicator.innerHTML = `
            <div class="admin-info">
                <span class="admin-icon">👤</span>
                <span class="admin-name">Admin: ${user.email}</span>
                <a href="admin.html" class="admin-panel-btn">Painel Admin</a>
            </div>
        `;
        
        // Inserir no topo da página
        document.body.insertBefore(adminIndicator, document.body.firstChild);
    }
}