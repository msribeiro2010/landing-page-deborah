import supabase from './supabase-client.js';

document.addEventListener('DOMContentLoaded', () => {
    // Verificar conectividade com Supabase antes de carregar imagens
    checkSupabaseConnection();
    loadPageImages();
    checkAdminStatus();
    
    console.log('Site carregado com sucesso!');
    
    // Adicionar indicador de status de conexão
    addConnectionStatus();
    
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
    try {
        const { data: images, error } = await supabase.rpc('get_all_images');

        if (error) {
            console.error('Erro ao carregar imagens da página:', error);
            loadFallbackContent();
            return;
        }

        if (!images || images.length === 0) {
            console.warn('Nenhuma imagem encontrada no banco de dados');
            loadFallbackContent();
            return;
        }

        // 1. Carregar Imagem do Topo (Hero)
        const heroImage = images.find(img => img.section === 'Topo');
        if (heroImage) {
            const heroSection = document.getElementById('home');
            if (heroSection) {
                // Testar se a imagem carrega antes de aplicar
                const img = new Image();
                img.onload = () => {
                    heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage.image_url})`;
                };
                img.onerror = () => {
                    console.warn('Erro ao carregar imagem do hero:', heroImage.image_url);
                };
                img.src = heroImage.image_url;
            }
        }

        // 2. Carregar Imagem "Sobre Mim"
        const aboutImage = images.find(img => img.section === 'Sobre Mim');
        if (aboutImage) {
            const aboutContainer = document.getElementById('about-image-container');
            if (aboutContainer) {
                const img = new Image();
                img.onload = () => {
                    aboutContainer.innerHTML = `<img src="${aboutImage.image_url}" alt="${aboutImage.title}" class="profile-pic">`;
                };
                img.onerror = () => {
                    console.warn('Erro ao carregar imagem sobre mim:', aboutImage.image_url);
                    aboutContainer.innerHTML = '<div class="profile-pic-placeholder"><i class="fas fa-user"></i></div>';
                };
                img.src = aboutImage.image_url;
            }
        }

        // 3. Carregar Galeria de "Serviços"
        const servicesImages = images.filter(img => img.section === 'Serviços');
        const servicesGallery = document.getElementById('services-gallery');
        if (servicesGallery) {
            servicesGallery.innerHTML = ''; // Limpa a área

            if (servicesImages.length > 0) {
                servicesImages.forEach(image => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    
                    // Testar carregamento da imagem
                    const img = new Image();
                    img.onload = () => {
                        card.innerHTML = `
                            <img src="${image.image_url}" alt="${image.title}">
                            <h3>${image.title}</h3>
                            <p>${image.description || ''}</p>
                        `;
                    };
                    img.onerror = () => {
                        console.warn('Erro ao carregar imagem do serviço:', image.image_url);
                        card.innerHTML = `
                            <div class="image-placeholder"><i class="fas fa-image"></i></div>
                            <h3>${image.title}</h3>
                            <p>${image.description || ''}</p>
                        `;
                    };
                    img.src = image.image_url;
                    
                    servicesGallery.appendChild(card);
                });
            } else {
                loadFallbackServices();
            }
        }
    } catch (error) {
        console.error('Erro geral ao carregar imagens:', error);
        loadFallbackContent();
    }
}

// Função para carregar conteúdo de fallback quando não há conexão com Supabase
function loadFallbackContent() {
    loadFallbackServices();
    
    // Fallback para imagem sobre mim
    const aboutContainer = document.getElementById('about-image-container');
    if (aboutContainer && !aboutContainer.innerHTML.trim()) {
        aboutContainer.innerHTML = '<div class="profile-pic-placeholder"><i class="fas fa-user"></i></div>';
    }
}

// Função para carregar serviços de fallback
function loadFallbackServices() {
    const servicesGallery = document.getElementById('services-gallery');
    if (servicesGallery) {
        servicesGallery.innerHTML = `
            <div class="card">
                <div class="image-placeholder"><i class="fas fa-spa"></i></div>
                <h3>Massagem Relaxante</h3>
                <p>Técnica especializada para alívio do estresse e tensões do dia a dia.</p>
            </div>
            <div class="card">
                <div class="image-placeholder"><i class="fas fa-hands"></i></div>
                <h3>Massagem Terapêutica</h3>
                <p>Tratamento focado em dores musculares e problemas posturais.</p>
            </div>
            <div class="card">
                <div class="image-placeholder"><i class="fas fa-leaf"></i></div>
                <h3>Drenagem Linfática</h3>
                <p>Estimula a circulação linfática e reduz retenção de líquidos.</p>
            </div>
        `;
    }
}

// Verificar conectividade com Supabase
async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('images').select('count', { count: 'exact', head: true });
        
        if (error) {
            console.warn('Problema de conectividade com Supabase:', error.message);
            updateConnectionStatus('offline');
        } else {
            console.log('Conectado ao Supabase com sucesso');
            updateConnectionStatus('online');
        }
    } catch (error) {
        console.error('Erro ao verificar conectividade:', error);
        updateConnectionStatus('offline');
    }
}

// Adicionar indicador de status de conexão
function addConnectionStatus() {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'connection-status';
    statusIndicator.className = 'connection-status checking';
    statusIndicator.innerHTML = `
        <i class="fas fa-circle"></i>
        <span>Verificando conexão...</span>
    `;
    
    // Inserir no canto superior direito
    document.body.appendChild(statusIndicator);
    
    // Remover após 5 segundos se estiver online
    setTimeout(() => {
        if (statusIndicator.classList.contains('online')) {
            statusIndicator.style.opacity = '0';
            setTimeout(() => statusIndicator.remove(), 300);
        }
    }, 5000);
}

// Atualizar status de conexão
function updateConnectionStatus(status) {
    const statusIndicator = document.getElementById('connection-status');
    if (statusIndicator) {
        statusIndicator.className = `connection-status ${status}`;
        
        if (status === 'online') {
            statusIndicator.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Conectado</span>
            `;
        } else {
            statusIndicator.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Modo offline</span>
            `;
        }
    }
}

// 4. Verificar Status do Administrador
async function checkAdminStatus() {
    try {
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
    } catch (error) {
        console.warn('Erro ao verificar status do admin:', error);
    }
}