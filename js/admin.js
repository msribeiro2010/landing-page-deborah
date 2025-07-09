import supabase from './supabase-client.js';

const galleryGrid = document.getElementById('gallery-grid');
const uploadForm = document.getElementById('upload-form');
const uploadMessage = document.getElementById('upload-message');
const logoutButton = document.getElementById('logout-button');

// 1. Proteção da Página e Autenticação
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    loadImages();
});

// 2. Logout
logoutButton.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
});

// 3. Carregar e Exibir Imagens Agrupadas por Seção
async function loadImages() {
    galleryGrid.innerHTML = 'Carregando imagens...';
    const { data: images, error } = await supabase.rpc('get_all_images');

    if (error) {
        console.error('Erro ao buscar imagens:', error);
        galleryGrid.innerHTML = 'Erro ao carregar imagens.';
        return;
    }

    galleryGrid.innerHTML = '';
    if (images.length === 0) {
        galleryGrid.innerHTML = '<p>Nenhuma imagem encontrada. Comece enviando uma nova!</p>';
        return;
    }

    // Agrupar imagens por seção
    const sections = images.reduce((acc, image) => {
        (acc[image.section] = acc[image.section] || []).push(image);
        return acc;
    }, {});

    // Renderizar cada seção
    for (const sectionName in sections) {
        const sectionContainer = document.createElement('div');
        sectionContainer.className = 'section-group';
        sectionContainer.innerHTML = `<h3>${sectionName}</h3>`;
        
        const sectionGrid = document.createElement('div');
        sectionGrid.className = 'gallery-grid';

        sections[sectionName].forEach(image => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <img src="${image.image_url}" alt="${image.title}">
                <div class="card-info">
                    <h4>${image.title}</h4>
                    <p>${image.description || ''}</p>
                    <button class="delete-button" data-id="${image.id}" data-url="${image.image_url}">Apagar</button>
                </div>
            `;
            sectionGrid.appendChild(card);
        });
        sectionContainer.appendChild(sectionGrid);
        galleryGrid.appendChild(sectionContainer);
    }

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

// 4. Enviar Nova Imagem
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    uploadMessage.textContent = 'Enviando...';

    const section = event.target.section.value;
    const title = event.target.title.value;
    const description = event.target.description.value;
    const imageFile = event.target['image-file'].files[0];

    if (!imageFile || !section) {
        uploadMessage.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        return;
    }

    const filePath = `${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, imageFile);

    if (uploadError) {
        console.error('Erro no upload:', uploadError);
        uploadMessage.textContent = `Erro no upload: ${uploadError.message}`;
        return;
    }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(filePath);

    const { error: dbError } = await supabase
        .from('images')
        .insert({ section, title, description, image_url: urlData.publicUrl });

    if (dbError) {
        console.error('Erro ao salvar no banco:', dbError);
        uploadMessage.textContent = 'Erro ao salvar informações da imagem.';
        return;
    }

    uploadMessage.textContent = 'Imagem enviada com sucesso!';
    uploadForm.reset();
    loadImages();

    setTimeout(() => { uploadMessage.textContent = '' }, 3000);
});

// 5. Apagar Imagem (Lógica de extração do path corrigida)
async function handleDelete(event) {
    const imageId = event.target.dataset.id;
    const imageUrl = event.target.dataset.url;

    if (!confirm('Tem certeza que deseja apagar esta imagem?')) return;

    const filePath = imageUrl.split('/photos/')[1];

    if (!filePath) {
        alert('Não foi possível determinar o caminho do arquivo para exclusão.');
        return;
    }

    const { error: storageError } = await supabase.storage.from('photos').remove([filePath]);

    if (storageError) {
        console.error('Erro ao apagar do Storage:', storageError);
        alert('Erro ao apagar o arquivo de imagem. Tente novamente.');
    }

    const { error: dbError } = await supabase.from('images').delete().eq('id', imageId);

    if (dbError) {
        console.error('Erro ao apagar do banco:', dbError);
        alert('Erro ao apagar informações da imagem.');
        return;
    }

    loadImages();
}