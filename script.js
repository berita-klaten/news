document.addEventListener('DOMContentLoaded', async () => {
  const fileList = document.getElementById('fileList');
  
  try {
    const res = await fetch('./latests/pages.json'); // ambil JSON
    const pages = await res.json();

    // Gunakan Set untuk memastikan tidak ada data duplikat berdasarkan fileName
    const seenFileNames = new Set();
    
    if (Array.isArray(pages) && pages.length > 0) {
      pages.forEach(page => {
        console.log(page);  // Untuk debugging, lihat data yang diterima

        // Cek jika fileName sudah ada dalam Set, kalau ada skip
        if (seenFileNames.has(page.fileName)) return;

        // Masukkan fileName ke dalam Set untuk cek duplikat
        seenFileNames.add(page.fileName);

        // Cek data validitas
        if (!page.fileName || !page.photoUrl || !page.nama) {
          console.warn('Data invalid:', page); // Memberi tahu jika ada data yang tidak lengkap
          return;
        }

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

          <script type="application/ld+json">
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "${page.nama || 'Nama Produk Tidak Tersedia'}",
              "image": "${page.photoUrl || 'default_image_url.jpg'}",
              "description": "${page.deskripsi || 'Deskripsi produk tidak tersedia'}",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "IDR",
                "price": "${page.harga || '0'}",
                "availability": "https://schema.org/InStock"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "${page.rating || '0'}",
                "reviewCount": "${page.reviewCount || '0'}"
              }
            }
          </script>
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
