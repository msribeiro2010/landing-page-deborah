import supabase from './supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
    loadPageImages();
    checkAdminStatus();
    
    console.log('Site carregado com sucesso!');
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-open');
            const icon = this.querySelector('i');
            
            if (navMenu.classList.contains('mobile-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // Smooth Scrolling para links de navegação
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Destacar link ativo na navegação
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Atualizar link ativo no scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Executar uma vez no carregamento
    
    // Adicionar animações suaves aos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.card, .gallery-item, .testimonial-card, .treatment-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
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