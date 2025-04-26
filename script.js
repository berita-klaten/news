document.addEventListener('DOMContentLoaded', async () => {
    const fileList = document.getElementById('fileList');
  
    try {
      const res = await fetch('./latests/pages.json'); // ambil JSON
      const pages = await res.json();
  
      if (Array.isArray(pages) && pages.length > 0) {
        pages.forEach(page => {
          const card = document.createElement('div');
          card.className = 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition p-4';
          card.setAttribute('itemscope', '');
          card.setAttribute('itemtype', 'https://schema.org/Product');
  
          card.innerHTML = `
            <a href="./latests/${page.fileName}" class="block mb-4">
              <img src="${page.photoUrl}" alt="${page.nama}" class="w-full h-48 object-cover rounded-lg">
            </a>
            <h2 itemprop="name" class="text-lg font-semibold text-blue-700 mb-4">
              ${page.nama}
            </h2>

            <div class="flex items-center justify-between mb-4">
              <p class="text-blue-600 text-xl font-bold" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                <span itemprop="priceCurrency" content="IDR">Rp</span><span itemprop="price">${page.harga || '0'}</span>
              </p>
              <div class="flex items-center" itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                <div class="flex text-yellow-400 text-lg mr-1">
                  ${'★'.repeat(Math.floor(page.rating || 5))}${'☆'.repeat(5 - Math.floor(page.rating || 5))}
                </div>
                <span class="text-sm text-gray-500" itemprop="ratingValue">(${page.rating || '5.0'})</span>
              </div>
            </div>

            <a href="./latests/${page.fileName}" class="inline-block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
              Lihat Detail
            </a>
          `;
  
          fileList.appendChild(card);
        });
      } else {
        fileList.innerHTML = `<div class="text-gray-500 text-center w-full">Tidak ada halaman ditemukan.</div>`;
      }
    } catch (error) {
      console.error('Gagal ambil daftar halaman:', error);
      fileList.innerHTML = `<div class="text-red-500 text-center w-full">Error mengambil daftar halaman.</div>`;
    }
});
