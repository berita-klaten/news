document.addEventListener('DOMContentLoaded', () => {
  /* ---------- SLIDER ---------- */
  const sliderInner = document.getElementById('sliderInner');
  const nextBtn     = document.getElementById('nextBtn');
  const prevBtn     = document.getElementById('prevBtn');
  const totalSlides = sliderInner.children.length;
  let currentIndex  = 0;

  const updateSlider = () =>
    sliderInner.style.transform = `translateX(-${currentIndex * 100}%)`;

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  });
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  });
  setInterval(() => nextBtn.click(), 5000);   // auto-slide

  /* ---------- LISTING + STRUCTURED DATA ---------- */
  const fileList = document.getElementById('fileList');

  fetch('./latests/pages.json')
    .then(r => r.json())
    .then(pages => {
      if (!Array.isArray(pages) || !pages.length)
        return fileList.innerHTML = `<div class="text-gray-500 text-center w-full">Tidak ada halaman ditemukan.</div>`;

      const seen    = new Set();             // antiduplikat
      const graph   = [];                    // kumpulan Product
      const itemEls = [];                    // ItemList

      pages.forEach((p, i) => {
        if (!p.fileName || !p.photoUrl || !p.nama) return;
        if (seen.has(p.fileName)) return;
        seen.add(p.fileName);

        /* ----- Render kartu HTML ----- */
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition p-4';
        card.innerHTML = `
          <a href="/${p.fileName}" class="block mb-4">
            <img src="${p.photoUrl}" alt="${p.nama}" class="w-full h-48 object-cover rounded-lg">
          </a>
          <h2 class="text-lg font-semibold text-blue-700 mb-4">${p.nama}</h2>
          <div class="flex items-center justify-between mb-4">
            <p class="text-blue-600 text-xl font-bold">Rp${p.harga ?? 0}</p>
            <div class="flex items-center">
              <div class="flex text-yellow-400 text-lg mr-1">
                ${'★'.repeat(Math.floor(p.rating ?? 5))}${'☆'.repeat(5 - Math.floor(p.rating ?? 5))}
              </div>
              <span class="text-sm text-gray-500">(${p.rating ?? 5})</span>
            </div>
          </div>
          <a href="/${p.fileName}" class="inline-block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
            Lihat Detail
          </a>`;
        fileList.appendChild(card);

        /* ----- Kumpulkan structured-data ----- */
        const prodURL = `https://berita-klaten.github.io/news/latests/${p.fileName}`;
        const prodId  = `${prodURL}#product`;

        itemEls.push({ "@type":"ListItem", position:i+1, url:prodId });

        const product = {
          "@type" : "Product",
          "@id"   : prodId,
          "name"  : p.nama,
          "image" : [p.photoUrl],
          "description": p.deskripsi ?? "",
          "sku"   : p.sku ?? `SKU-${i+1}`,
          "offers": {
            "@type": "Offer",
            "url" : prodURL,
            "priceCurrency": "IDR",
            "price": String(p.harga ?? 0),
            "availability": "https://schema.org/InStock"
          }
        };

        if (p.rating && p.ratingCount) {
          product.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue" : Number(p.rating),
            "ratingCount" : Number(p.ratingCount)
          };
        }

        if (Array.isArray(p.review) && p.review.length)
          product.review = p.review;      // review sudah dalam format valid

        graph.push(product);
      });

      /* ----- Sematkan JSON-LD tunggal di <head> ----- */
      graph.unshift({ "@type":"ItemList", "itemListElement": itemEls });

      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph"  : graph
      });
      document.head.appendChild(ld);
    })
    .catch(err => {
      console.error('Gagal ambil daftar halaman:', err);
      fileList.innerHTML = `<div class="text-red-500 text-center w-full">Error mengambil daftar halaman.</div>`;
    });
});
